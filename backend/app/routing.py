from math import hypot
from typing import Any
import networkx as nx
import osmnx as ox


def _best_edge_data(G, u, v) -> dict[str, Any]:
    edge_dict = G.get_edge_data(u, v)
    if not edge_dict:
        raise nx.NetworkXNoPath(f"No edge data for {u} -> {v}")
    _, data = min(
        edge_dict.items(),
        key=lambda kv: float(kv[1].get("length", float("inf"))),
    )
    return data


def _route_coordinates(G, route: list[int]) -> list[list[float]]:
    coords: list[list[float]] = []

    for u, v in zip(route[:-1], route[1:]):
        data = _best_edge_data(G, u, v)
        geom = data.get("geometry")

        if geom is not None:
            segment = [[float(x), float(y)] for x, y in geom.coords]
        else:
            segment = [
                [float(G.nodes[u]["x"]), float(G.nodes[u]["y"])],
                [float(G.nodes[v]["x"]), float(G.nodes[v]["y"])],
            ]

        ux, uy = float(G.nodes[u]["x"]), float(G.nodes[u]["y"])
        d_first = hypot(segment[0][0] - ux, segment[0][1] - uy)
        d_last = hypot(segment[-1][0] - ux, segment[-1][1] - uy)
        if d_last < d_first:
            segment.reverse()

        if coords and segment and coords[-1] == segment[0]:
            segment = segment[1:]
        coords.extend(segment)

    return coords


def get_shortest_walking_route(
    G,
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
) -> dict[str, Any]:
    start_node = ox.distance.nearest_nodes(G, X=start_lon, Y=start_lat)
    end_node = ox.distance.nearest_nodes(G, X=end_lon, Y=end_lat)

    route = nx.shortest_path(
        G,
        source=start_node,
        target=end_node,
        weight="length",
        method="dijkstra",
    )

    distance_m = 0.0
    for u, v in zip(route[:-1], route[1:]):
        data = _best_edge_data(G, u, v)
        distance_m += float(data.get("length", 0.0))

    coordinates = _route_coordinates(G, route)

    return {
        "start_node": int(start_node),
        "end_node": int(end_node),
        "distance_m": round(distance_m, 1),
        "distance_miles": round(distance_m / 1609.344, 3),
        "estimated_walk_minutes": round(distance_m / 1.4 / 60.0, 1),
        "node_count": len(route),
        "coordinates": coordinates,
        "geojson": {
            "type": "Feature",
            "properties": {
                "routing_mode": "shortest_walk",
                "weight": "length",
                "distance_m": round(distance_m, 1),
            },
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates,
            },
        },
    }
