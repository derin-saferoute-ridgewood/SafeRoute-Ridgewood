from math import hypot
from typing import Any

import networkx as nx
import osmnx as ox


def _best_edge_data(
    G,
    u,
    v,
    weight_attribute: str = "length",
) -> dict[str, Any]:
    """
    Return the best parallel edge between u and v
    according to the routing weight currently being used.
    """

    edge_dict = G.get_edge_data(u, v)

    if not edge_dict:
        raise nx.NetworkXNoPath(
            f"No edge data for {u} -> {v}"
        )

    def edge_cost(item):
        _, data = item

        if weight_attribute in data:
            return float(data[weight_attribute])

        if "length" in data:
            return float(data["length"])

        return float("inf")

    _, data = min(
        edge_dict.items(),
        key=edge_cost,
    )

    return data


def _route_coordinates(
    G,
    route: list[int],
    weight_attribute: str,
) -> list[list[float]]:
    """
    Convert NetworkX route nodes into ordered
    GeoJSON-compatible [longitude, latitude] coordinates.
    """

    coords: list[list[float]] = []

    for u, v in zip(
        route[:-1],
        route[1:],
    ):
        data = _best_edge_data(
            G,
            u,
            v,
            weight_attribute,
        )

        geom = data.get("geometry")

        if geom is not None:
            segment = [
                [float(x), float(y)]
                for x, y in geom.coords
            ]

        else:
            segment = [
                [
                    float(G.nodes[u]["x"]),
                    float(G.nodes[u]["y"]),
                ],
                [
                    float(G.nodes[v]["x"]),
                    float(G.nodes[v]["y"]),
                ],
            ]

        # Ensure geometry runs from u -> v.
        ux = float(G.nodes[u]["x"])
        uy = float(G.nodes[u]["y"])

        d_first = hypot(
            segment[0][0] - ux,
            segment[0][1] - uy,
        )

        d_last = hypot(
            segment[-1][0] - ux,
            segment[-1][1] - uy,
        )

        if d_last < d_first:
            segment.reverse()

        # Avoid duplicate point where segments meet.
        if (
            coords
            and segment
            and coords[-1] == segment[0]
        ):
            segment = segment[1:]

        coords.extend(segment)

    return coords


def _physical_distance(
    G,
    route: list[int],
    weight_attribute: str,
) -> float:
    """
    Return actual walking distance in meters,
    regardless of which routing weight was used.
    """

    distance_m = 0.0

    for u, v in zip(
        route[:-1],
        route[1:],
    ):
        data = _best_edge_data(
            G,
            u,
            v,
            weight_attribute,
        )

        distance_m += float(
            data.get(
                "length",
                0.0,
            )
        )

    return distance_m


def _routing_cost(
    G,
    route: list[int],
    weight_attribute: str,
) -> float:
    """
    Return the numerical cost that Dijkstra minimized.
    """

    total = 0.0

    for u, v in zip(
        route[:-1],
        route[1:],
    ):
        data = _best_edge_data(
            G,
            u,
            v,
            weight_attribute,
        )

        value = data.get(
            weight_attribute,
            data.get(
                "length",
                0.0,
            ),
        )

        total += float(value)

    return total


def _route_crash_stats(
    G,
    route: list[int],
    weight_attribute: str,
) -> dict[str, float | int]:
    """
    Summarize crash exposure along the selected route.
    """

    crash_edges = 0
    crash_count_total = 0
    max_crash_score = 0.0

    for u, v in zip(
        route[:-1],
        route[1:],
    ):
        data = _best_edge_data(
            G,
            u,
            v,
            weight_attribute,
        )

        crash_count = int(
            float(
                data.get(
                    "crash_count",
                    0,
                )
            )
        )

        crash_score = float(
            data.get(
                "crash_score",
                0.0,
            )
        )

        if crash_count > 0:
            crash_edges += 1

        crash_count_total += crash_count

        max_crash_score = max(
            max_crash_score,
            crash_score,
        )

    return {
        "crash_edges": crash_edges,
        "crash_count_total": crash_count_total,
        "max_crash_score": round(
            max_crash_score,
            3,
        ),
    }


def get_shortest_walking_route(
    G,
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
    weight_attribute: str = "length",
) -> dict[str, Any]:

    valid_weights = {
        "length",
        "final_weight",
    }

    if weight_attribute not in valid_weights:
        raise ValueError(
            "Unsupported routing weight: "
            f"{weight_attribute}"
        )

    # Crash-aware routing requires final_weight
    # on every graph edge.
    if weight_attribute == "final_weight":

        missing_count = 0

        for _, _, _, data in G.edges(
            keys=True,
            data=True,
        ):
            if "final_weight" not in data:
                missing_count += 1

        if missing_count > 0:
            raise ValueError(
                "Crash-aware graph is "
                f"missing final_weight on "
                f"{missing_count} edges. "
                "Run add_crash_weights.py again."
            )

    # --------------------------------------------------
    # Find nearest graph nodes
    # --------------------------------------------------

    start_node = ox.distance.nearest_nodes(
        G,
        X=start_lon,
        Y=start_lat,
    )

    end_node = ox.distance.nearest_nodes(
        G,
        X=end_lon,
        Y=end_lat,
    )

    # --------------------------------------------------
    # Calculate route
    # --------------------------------------------------

    try:
        route = nx.shortest_path(
            G,
            source=start_node,
            target=end_node,
            weight=weight_attribute,
            method="dijkstra",
        )

    except nx.NetworkXNoPath as exc:
        raise nx.NetworkXNoPath(
            "No walking route could be found "
            "between these points."
        ) from exc

    # --------------------------------------------------
    # Route measurements
    # --------------------------------------------------

    distance_m = _physical_distance(
        G,
        route,
        weight_attribute,
    )

    routing_cost = _routing_cost(
        G,
        route,
        weight_attribute,
    )

    coordinates = _route_coordinates(
        G,
        route,
        weight_attribute,
    )

    crash_stats = _route_crash_stats(
        G,
        route,
        weight_attribute,
    )

    # --------------------------------------------------
    # Routing mode
    # --------------------------------------------------

    if weight_attribute == "length":
        routing_mode = "shortest"

    else:
        routing_mode = "crash_aware"

    # --------------------------------------------------
    # Return API-ready response
    # --------------------------------------------------

    return {
        "start_node": int(start_node),
        "end_node": int(end_node),

        "routing_mode": routing_mode,
        "weight": weight_attribute,

        "distance_m": round(
            distance_m,
            1,
        ),

        "distance_miles": round(
            distance_m / 1609.344,
            3,
        ),

        "estimated_walk_minutes": round(
            distance_m / 1.4 / 60.0,
            1,
        ),

        "routing_cost": round(
            routing_cost,
            2,
        ),

        "crash_edges":
            crash_stats["crash_edges"],

        "crash_count_total":
            crash_stats["crash_count_total"],

        "max_crash_score":
            crash_stats["max_crash_score"],

        "node_count": len(route),

        "coordinates": coordinates,

        "geojson": {
            "type": "Feature",

            "properties": {
                "routing_mode":
                    routing_mode,

                "weight":
                    weight_attribute,

                "distance_m":
                    round(
                        distance_m,
                        1,
                    ),

                "routing_cost":
                    round(
                        routing_cost,
                        2,
                    ),

                "crash_edges":
                    crash_stats[
                        "crash_edges"
                    ],

                "crash_count_total":
                    crash_stats[
                        "crash_count_total"
                    ],

                "max_crash_score":
                    crash_stats[
                        "max_crash_score"
                    ],
            },

            "geometry": {
                "type": "LineString",
                "coordinates": coordinates,
            },
        },
    }