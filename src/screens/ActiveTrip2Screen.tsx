import { useEffect, useMemo, useState } from "react"
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useNavigate } from "react-router"
import { useApp, type RouteOption } from "../context/AppContext"

function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "")
  }

  return "/api"
}

const API_BASE = resolveApiBaseUrl()
const CARTO_RASTER_URL =
  "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_4ubv_1_d053d007b1a5dba926575288"
const DEFAULT_START = { lat: 40.9622, lon: -74.1057 }
const DEFAULT_END = { lat: 40.979, lon: -74.1143 }

type CoordinatePoint = { lat: number; lon: number }

type EditTarget = "start" | "end"

interface BackendRouteResponse {
  routing_mode: RouteOption
  distance_m: number
  distance_miles: number
  estimated_walk_minutes: number
  route_safety_score?: number
  crash_edges?: number
  crash_count_total?: number
  coordinates: [number, number][]
}

interface CoverageNode {
  id: number
  lat: number
  lon: number
}

interface CoverageResponse {
  nodes: CoverageNode[]
  edges: [number, number][][]
  count: {
    nodes: number
    edges: number
  }
}

function MapController({ positions }: { positions: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (!positions.length) return
    const bounds = L.latLngBounds(positions)
    map.fitBounds(bounds, { padding: [30, 30] })
    requestAnimationFrame(() => map.invalidateSize())
  }, [map, positions])

  return null
}

function MapLocationPicker({
  activeTarget,
  onSelect,
}: {
  activeTarget: EditTarget
  onSelect: (point: CoordinatePoint) => void
}) {
  useMapEvents({
    click(event) {
      void onSelect({
        lat: Number(event.latlng.lat.toFixed(6)),
        lon: Number(event.latlng.lng.toFixed(6)),
      })
    },
  })

  return <div className="hidden">{activeTarget}</div>
}

const routeConfig: Record<RouteOption, { label: string; color: string }> = {
  fastest: { label: "Fastest", color: "#2774C7" },
  safest: { label: "Safest", color: "#168B82" },
}

export default function ActiveTrip2Screen() {
  const navigate = useNavigate()
  const {
    selectedRoute,
    setSelectedRoute,
    crashDataset,
    setCrashDataset,
    preferenceValue,
    setPreferenceValue,
  } = useApp()
  const [startPoint, setStartPoint] = useState<CoordinatePoint>(DEFAULT_START)
  const [endPoint, setEndPoint] = useState<CoordinatePoint>(DEFAULT_END)
  const [activeTarget, setActiveTarget] = useState<EditTarget>("start")
  const [routeData, setRouteData] = useState<BackendRouteResponse | null>(null)
  const [coverageData, setCoverageData] = useState<CoverageResponse | null>(
    null,
  )
  const [showCoverage, setShowCoverage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchCoverage() {
      try {
        const response = await fetch(`${API_BASE}/coverage`)
        if (!response.ok) {
          throw new Error("Failed to load SafeRoute coverage data.")
        }

        const payload = (await response.json()) as CoverageResponse
        if (active) {
          setCoverageData(payload)
        }
      } catch (coverageError) {
        console.error("[CoverageDebug] Failed to load coverage", coverageError)
      }
    }

    void fetchCoverage()
    return () => {
      active = false
    }
  }, [])

  const updateActivePoint = async (point: CoordinatePoint) => {
    try {
      const response = await fetch(`${API_BASE}/snap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: point.lat, lon: point.lon }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          payload?.detail ||
            "Can't place a dot there — there isn't a road nearby.",
        )
      }

      if (
        !payload?.valid ||
        typeof payload.lat !== "number" ||
        typeof payload.lon !== "number"
      ) {
        throw new Error("Can't place a dot there — there isn't a road nearby.")
      }

      const snappedPoint = { lat: payload.lat, lon: payload.lon }
      if (activeTarget === "start") {
        setStartPoint(snappedPoint)
      } else {
        setEndPoint(snappedPoint)
      }
      setError(null)
    } catch (snapError) {
      setError(
        snapError instanceof Error
          ? snapError.message
          : "Can't place a dot there — there isn't a road nearby.",
      )
    }
  }

  useEffect(() => {
    let active = true

    async function fetchRoute() {
      setLoading(true)
      setError(null)

      const requestBody = {
        start_lat: startPoint.lat,
        start_lon: startPoint.lon,
        end_lat: endPoint.lat,
        end_lon: endPoint.lon,
        mode: selectedRoute,
        crash_dataset: crashDataset,
      }

      console.log("[RouteDebug] Sending request", { API_BASE, requestBody })

      try {
        const response = await fetch(`${API_BASE}/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })

        console.log(
          "[RouteDebug] Response status",
          response.status,
          response.ok,
        )

        const text = await response.text()
        let payload: any = null

        if (text) {
          try {
            payload = JSON.parse(text)
          } catch {
            throw new Error("Backend returned a non-JSON response.")
          }
        }

        console.log(
          "[RouteDebug] Response payload keys",
          payload ? Object.keys(payload) : null,
        )

        if (!response.ok) {
          throw new Error(payload?.detail || "Route request failed.")
        }

        if (
          !Array.isArray(payload?.coordinates) ||
          payload.coordinates.length === 0
        ) {
          throw new Error("Backend returned no route geometry.")
        }

        console.log(
          "[RouteDebug] Coordinates count",
          payload.coordinates.length,
        )

        if (active) {
          setRouteData(payload)
        }
      } catch (fetchError) {
        console.error("[RouteDebug] Route request failed", fetchError)
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Route request failed.",
          )
          setRouteData(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchRoute()
    return () => {
      active = false
    }
  }, [
    selectedRoute,
    startPoint.lat,
    startPoint.lon,
    endPoint.lat,
    endPoint.lon,
    crashDataset,
  ])

  const routeCoordinates = useMemo<[number, number][]>(() => {
    if (!Array.isArray(routeData?.coordinates) || !routeData.coordinates.length)
      return []

    const mapped = routeData.coordinates.map(
      ([lng, lat]) => [lat, lng] as [number, number],
    )
    console.log("[RouteDebug] RouteCoordinates mapped", mapped.length)
    return mapped
  }, [routeData])

  const routeSummary = useMemo(() => {
    const config = routeConfig[selectedRoute]

    if (!routeData) {
      return {
        header: config.label,
        distance: "Loading…",
        time: "Loading…",
        score: "—",
      }
    }

    return {
      header: config.label,
      distance: `${(routeData.distance_miles || 0).toFixed(2)} mi`,
      time: `${routeData.estimated_walk_minutes || 0} min`,
      score:
        routeData.route_safety_score !== undefined
          ? `${routeData.route_safety_score}/100`
          : "—",
    }
  }, [routeData, selectedRoute])

  const coveragePositions: [number, number][] = useMemo(
    () =>
      (coverageData?.nodes ?? []).map(
        (node) => [node.lat, node.lon] as [number, number],
      ),
    [coverageData],
  )

  const fallbackPositions: [number, number][] = [
    [startPoint.lat, startPoint.lon],
    [endPoint.lat, endPoint.lon],
  ]

  const mapCenter: LatLngExpression = routeCoordinates.length
    ? [routeCoordinates[0][0], routeCoordinates[0][1]]
    : coveragePositions.length
      ? [coveragePositions[0][0], coveragePositions[0][1]]
      : [
          (startPoint.lat + endPoint.lat) / 2,
          (startPoint.lon + endPoint.lon) / 2,
        ]

  return (
    <div
      className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F5F7F7] text-[#263238]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <header className="z-20 flex shrink-0 items-center justify-between border-b border-[#E7EAEF] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate("/route-config")}
          className="text-[13px] font-bold text-[#2774C7]"
        >
          Back
        </button>
        <div className="text-[15px] font-black uppercase tracking-[0.16em] text-[#263238]">
          Active trip
        </div>
        <div className="w-12" />
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={15}
          scrollWheelZoom
          className="absolute inset-0"
          style={{ height: "100%", width: "100%" }}
          attributionControl
        >
          <TileLayer
            url={CARTO_RASTER_URL}
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            maxZoom={19}
          />
          <MapLocationPicker
            activeTarget={activeTarget}
            onSelect={updateActivePoint}
          />
          {(routeCoordinates.length > 0
            ? routeCoordinates
            : coveragePositions.length > 0
              ? coveragePositions
              : fallbackPositions
          ).length > 0 && (
            <MapController
              positions={
                routeCoordinates.length > 0
                  ? routeCoordinates
                  : coveragePositions.length > 0
                    ? coveragePositions
                    : fallbackPositions
              }
            />
          )}

          {showCoverage &&
            coverageData?.edges.map((edge, index) => (
              <Polyline
                key={`coverage-edge-${index}`}
                positions={edge.map(
                  ([lng, lat]) => [lat, lng] as [number, number],
                )}
                pathOptions={{
                  color: "#2FBF90",
                  weight: 1.5,
                  opacity: 0.35,
                }}
              />
            ))}

          {showCoverage &&
            coverageData?.nodes.map((node) => (
              <CircleMarker
                key={node.id}
                center={[node.lat, node.lon]}
                radius={2.2}
                pathOptions={{
                  color: "#2FBF90",
                  fillColor: "#2FBF90",
                  fillOpacity: 0.9,
                }}
              />
            ))}

          {routeCoordinates.length > 0 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: routeConfig[selectedRoute].color,
                weight: 6,
                opacity: 1,
              }}
            />
          )}

          <CircleMarker
            center={[startPoint.lat, startPoint.lon]}
            radius={8}
            pathOptions={{
              color: "#F26A21",
              fillColor: "#F26A21",
              fillOpacity: 1,
            }}
          />
          <CircleMarker
            center={[endPoint.lat, endPoint.lon]}
            radius={8}
            pathOptions={{
              color: "#18384A",
              fillColor: "#18384A",
              fillOpacity: 1,
            }}
          />
        </MapContainer>
      </div>

      <div className="z-20 max-h-[58dvh] shrink-0 overflow-y-auto border-t border-[#E7EAEF] bg-white px-4 py-3">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-3 rounded-2xl border border-[#E7EAEF] bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7A8084]">
                  Current route
                </div>
                <div className="mt-0.5 text-[17px] font-black text-[#263238]">
                  {routeSummary.header}
                </div>
              </div>
              <div
                className="rounded-full px-2 py-1 text-[10px] font-black uppercase"
                style={{
                  background: `${routeConfig[selectedRoute].color}20`,
                  color: routeConfig[selectedRoute].color,
                }}
              >
                {selectedRoute}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[#F4F7FA] px-2 py-1.5">
                <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
                  Distance
                </div>
                <div className="mt-0.5 text-[13px] font-black text-[#263238]">
                  {routeSummary.distance}
                </div>
              </div>
              <div className="rounded-xl bg-[#F4F7FA] px-2 py-1.5">
                <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
                  Time
                </div>
                <div className="mt-0.5 text-[13px] font-black text-[#263238]">
                  {routeSummary.time}
                </div>
              </div>
              <div className="rounded-xl bg-[#F4F7FA] px-2 py-1.5">
                <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
                  Safety
                </div>
                <div className="mt-0.5 text-[13px] font-black text-[#263238]">
                  {routeSummary.score}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 flex gap-2">
            {(["fastest", "safest"] as RouteOption[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedRoute(mode)}
                className="flex-1 rounded-xl border px-3 py-2 text-[13px] font-black"
                style={{
                  borderColor:
                    selectedRoute === mode
                      ? routeConfig[mode].color
                      : "#E7EAEF",
                  background:
                    selectedRoute === mode
                      ? `${routeConfig[mode].color}14`
                      : "white",
                  color: routeConfig[mode].color,
                }}
              >
                {routeConfig[mode].label}
              </button>
            ))}
          </div>

          <div className="mb-3 rounded-xl border border-[#E7EAEF] bg-[#F9FAFB] p-3">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
              Crash data
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["low", "Current data"],
                ["high", "Expanded · Crash.csv"],
                ["unverified", "Most data · unverified"],
              ] as const).map(([dataset, label]) => (
                <button
                  key={dataset}
                  type="button"
                  onClick={() => setCrashDataset(dataset)}
                  aria-pressed={crashDataset === dataset}
                  className="rounded-lg border px-2 py-2 text-[11px] font-black"
                  style={{
                    borderColor: crashDataset === dataset ? "#168B82" : "#E7EAEF",
                    background: crashDataset === dataset ? "#EAFBF5" : "white",
                    color: crashDataset === dataset ? "#168B82" : "#5E6B70",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTarget("start")}
              className="rounded-xl border px-3 py-2 text-[12px] font-black"
              style={{
                borderColor: activeTarget === "start" ? "#F26A21" : "#E7EAEF",
                background: activeTarget === "start" ? "#FFF3EA" : "white",
                color: "#263238",
              }}
            >
              Set start point
            </button>
            <button
              type="button"
              onClick={() => setActiveTarget("end")}
              className="rounded-xl border px-3 py-2 text-[12px] font-black"
              style={{
                borderColor: activeTarget === "end" ? "#F26A21" : "#E7EAEF",
                background: activeTarget === "end" ? "#FFF3EA" : "white",
                color: "#263238",
              }}
            >
              Set end point
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E7EAEF] bg-[#F9FAFB] px-3 py-2">
            <button
              type="button"
              onClick={() => setShowCoverage((value) => !value)}
              className="rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]"
              style={{
                borderColor: showCoverage ? "#2FBF90" : "#E7EAEF",
                background: showCoverage ? "#EAFBF5" : "white",
                color: showCoverage ? "#168B82" : "#5E6B70",
              }}
            >
              {showCoverage ? "Coverage on" : "Coverage off"}
            </button>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
              Safety priority
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={preferenceValue}
                onChange={(event) =>
                  setPreferenceValue(Number(event.target.value))
                }
                className="h-2 w-28 accent-[#168B82]"
                aria-label="Safety priority"
              />
              <span className="text-[12px] text-[#263238]">
                {preferenceValue}%
              </span>
            </label>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <label className="rounded-xl border border-[#E7EAEF] bg-[#F9FAFB] p-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
              Start lat
              <input
                type="number"
                step="0.0001"
                value={startPoint.lat}
                onChange={(event) =>
                  setStartPoint({
                    ...startPoint,
                    lat: Number(event.target.value),
                  })
                }
                className="mt-2 w-full rounded-lg border border-[#DDE3E8] bg-white px-2 py-2 text-[13px] font-semibold text-[#263238]"
              />
            </label>
            <label className="rounded-xl border border-[#E7EAEF] bg-[#F9FAFB] p-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
              Start lon
              <input
                type="number"
                step="0.0001"
                value={startPoint.lon}
                onChange={(event) =>
                  setStartPoint({
                    ...startPoint,
                    lon: Number(event.target.value),
                  })
                }
                className="mt-2 w-full rounded-lg border border-[#DDE3E8] bg-white px-2 py-2 text-[13px] font-semibold text-[#263238]"
              />
            </label>
            <label className="rounded-xl border border-[#E7EAEF] bg-[#F9FAFB] p-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
              End lat
              <input
                type="number"
                step="0.0001"
                value={endPoint.lat}
                onChange={(event) =>
                  setEndPoint({ ...endPoint, lat: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-lg border border-[#DDE3E8] bg-white px-2 py-2 text-[13px] font-semibold text-[#263238]"
              />
            </label>
            <div className="rounded-xl border border-[#E7EAEF] bg-[#F9FAFB] p-2">
              <label className="text-[11px] font-black uppercase tracking-[0.12em] text-[#7A8084]">
                End lon
                <input
                  type="number"
                  step="0.0001"
                  value={endPoint.lon}
                  onChange={(event) =>
                    setEndPoint({
                      ...endPoint,
                      lon: Number(event.target.value),
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-[#DDE3E8] bg-white px-2 py-2 text-[13px] font-semibold text-[#263238]"
                />
              </label>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#5E6B70]">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2FBF90]" />
            <span>
              Click the map to set the {activeTarget} point. Coverage can be
              toggled on or off below.
            </span>
          </div>

          {loading && (
            <div className="text-[13px] font-semibold text-[#5E6B70]">
              Loading live route…
            </div>
          )}
          {error && (
            <div className="text-[13px] font-semibold text-[#B42318]">
              {error}
            </div>
          )}
          {!loading && !error && routeData && (
            <div className="space-y-1 text-[12px] leading-relaxed text-[#5E6B70]">
              <div>
                {routeData.crash_edges !== undefined &&
                routeData.crash_count_total !== undefined
                  ? `Risk summary: ${routeData.crash_edges} edge(s) in crash data across ${routeData.crash_count_total} incidents.`
                  : "Route updated from backend."}
              </div>
              <div className="font-semibold text-[#263238]">
                Geometry points: {routeCoordinates.length}
              </div>
              <div className="font-semibold text-[#263238]">
                Polyline mounted: {routeCoordinates.length > 0 ? "yes" : "no"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
