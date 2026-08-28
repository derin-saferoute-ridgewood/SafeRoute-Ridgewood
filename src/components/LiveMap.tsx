import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon paths broken by Vite's bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// Ridgewood, NJ real coordinates
const SCHOOL: [number, number] = [40.9622, -74.1057];
const STATION: [number, number] = [40.9790, -74.1143];
const CENTER: [number, number] = [40.9706, -74.1100];
const SEGMENT_CENTER: [number, number] = [40.9660, -74.1130];

type RouteKey = 'fastest' | 'balanced' | 'pedestrian';

const ROUTES: Record<RouteKey, { color: string; weight: number; dashArray?: string; positions: [number, number][] }> = {
  fastest: {
    color: '#2774C7',
    weight: 4,
    positions: [
      SCHOOL,
      [40.9625, -74.1070],
      [40.9635, -74.1093],
      [40.9648, -74.1120],
      [40.9660, -74.1140],
      [40.9700, -74.1143],
      [40.9745, -74.1143],
      STATION,
    ],
  },
  balanced: {
    color: '#F26A21',
    weight: 6,
    positions: [
      SCHOOL,
      [40.9635, -74.1070],
      [40.9652, -74.1082],
      [40.9670, -74.1095],
      [40.9692, -74.1108],
      [40.9715, -74.1120],
      [40.9748, -74.1130],
      [40.9775, -74.1137],
      STATION,
    ],
  },
  pedestrian: {
    color: '#168B82',
    weight: 4,
    dashArray: '10, 6',
    positions: [
      SCHOOL,
      [40.9630, -74.1060],
      [40.9643, -74.1065],
      [40.9658, -74.1073],
      [40.9672, -74.1082],
      [40.9688, -74.1094],
      [40.9705, -74.1107],
      [40.9722, -74.1118],
      [40.9742, -74.1127],
      [40.9762, -74.1134],
      [40.9780, -74.1140],
      STATION,
    ],
  },
};

// User positions: on-route (balanced midpoint) and off-route
const USER_ON_ROUTE: [number, number] = [40.9692, -74.1108];
const USER_OFF_ROUTE: [number, number] = [40.9685, -74.1085];

// Annotation: problem crossing near Maple Ave
const ANNOTATION_PROBLEM: [number, number] = [40.9660, -74.1140];
const ANNOTATION_GOOD: [number, number] = [40.9722, -74.1118];

interface LiveMapProps {
  selectedRoute?: RouteKey;
  showUserDot?: boolean;
  userOffRoute?: boolean;
  showAnnotations?: boolean;
  zoomSegment?: boolean;
  height?: string | number;
  className?: string;
}

function MapController({ zoomSegment, selectedRoute }: { zoomSegment?: boolean; selectedRoute?: RouteKey }) {
  const map = useMap();
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (zoomSegment) {
      map.setView(SEGMENT_CENTER, 17);
    } else if (selectedRoute && ROUTES[selectedRoute]) {
      map.fitBounds(L.latLngBounds(ROUTES[selectedRoute].positions), { padding: [40, 40] });
    } else {
      map.setView(CENTER, 15);
    }
  }, [map, zoomSegment, selectedRoute]);
  return null;
}

export default function LiveMap({
  selectedRoute,
  showUserDot = false,
  userOffRoute = false,
  showAnnotations = false,
  zoomSegment = false,
  height,
  className = '',
}: LiveMapProps) {
  const containerStyle: React.CSSProperties = {
    height: height ?? '100%',
    width: '100%',
  };

  const routesToShow: RouteKey[] = selectedRoute ? [selectedRoute] : ['fastest', 'balanced', 'pedestrian'];
  const userPos: [number, number] = userOffRoute ? USER_OFF_ROUTE : USER_ON_ROUTE;

  return (
    <div style={containerStyle} className={className}>
      <MapContainer
        center={CENTER}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
        scrollWheelZoom={false}
      >
        <MapController zoomSegment={zoomSegment} selectedRoute={selectedRoute} />

        {/* CartoDB Positron — clean, minimal, civic */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        {/* Route polylines */}
        {routesToShow.map(key => {
          const r = ROUTES[key];
          const isSelected = selectedRoute === key;
          return (
            <Polyline
              key={key}
              positions={r.positions}
              pathOptions={{
                color: r.color,
                weight: isSelected ? r.weight + 2 : r.weight,
                dashArray: r.dashArray,
                opacity: selectedRoute && !isSelected ? 0.4 : 1,
              }}
            >
              <Tooltip sticky direction="top" offset={[0, -4]} opacity={0.92}>
                {key === 'fastest' && 'Fastest · 14 min · Score 68'}
                {key === 'balanced' && 'Balanced · 16 min · Score 81 ✦'}
                {key === 'pedestrian' && 'Pedestrian-friendly · 19 min · Score 89'}
              </Tooltip>
            </Polyline>
          );
        })}

        {/* School marker */}
        <CircleMarker
          center={SCHOOL}
          radius={10}
          pathOptions={{ color: '#F26A21', fillColor: '#F26A21', fillOpacity: 1, weight: 3 }}
        >
          <Tooltip direction="right" offset={[8, 0]} permanent={false} opacity={0.95}>
            Ridgewood High School
          </Tooltip>
        </CircleMarker>

        {/* Station marker */}
        <CircleMarker
          center={STATION}
          radius={10}
          pathOptions={{ color: '#18384A', fillColor: '#18384A', fillOpacity: 1, weight: 3 }}
        >
          <Tooltip direction="left" offset={[-8, 0]} permanent={false} opacity={0.95}>
            Ridgewood Train Station
          </Tooltip>
        </CircleMarker>

        {/* User location dot */}
        {showUserDot && (
          <CircleMarker
            center={userPos}
            radius={9}
            pathOptions={{
              color: userOffRoute ? '#D9534F' : '#2774C7',
              fillColor: userOffRoute ? '#D9534F' : '#2774C7',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              {userOffRoute ? 'Off route — 0.12 mi away' : 'You are here'}
            </Tooltip>
          </CircleMarker>
        )}

        {/* Pulsing accuracy circle for user dot */}
        {showUserDot && (
          <CircleMarker
            center={userPos}
            radius={22}
            pathOptions={{
              color: userOffRoute ? '#D9534F' : '#2774C7',
              fillColor: userOffRoute ? '#D9534F' : '#2774C7',
              fillOpacity: 0.12,
              weight: 0,
            }}
          />
        )}

        {/* Annotations */}
        {showAnnotations && (
          <>
            <CircleMarker
              center={ANNOTATION_PROBLEM}
              radius={12}
              pathOptions={{ color: '#D9534F', fillColor: '#D9534F', fillOpacity: 0.2, weight: 2, dashArray: '4, 3' }}
            >
              <Tooltip direction="top" offset={[0, -14]} permanent opacity={0.95}>
                ⚠ Maple Ave crossing · Score 58
              </Tooltip>
            </CircleMarker>
            <CircleMarker
              center={ANNOTATION_GOOD}
              radius={10}
              pathOptions={{ color: '#168B82', fillColor: '#168B82', fillOpacity: 0.2, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -12]} permanent opacity={0.95}>
                ✓ Residential section · Score 89
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
