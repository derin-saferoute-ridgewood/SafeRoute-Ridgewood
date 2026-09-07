from math import hypot
from typing import Any

import networkx as nx
import osmnx as ox


VALID_WEIGHTS = {
    "length",
    "safety_weight",
}


def _best_edge_data(
    G,
    u,
    v,
    weight_attribute: str,
) -> dict[str, Any]:

    edge_dict = G.get_edge_data(
        u,
        v,
    )

    if not edge_dict:

        raise nx.NetworkXNoPath(
            f"No edge data for "
            f"{u} -> {v}"
        )

    def edge_cost(item):

        _, data = item

        value = data.get(
            weight_attribute,
            data.get(
                "length",
                float("inf"),
            ),
        )

        return float(value)

    _, data = min(
        edge_dict.items(),
        key=edge_cost,
    )

    return data


def _route_coordinates(
    G,
    route,
    weight_attribute,
):

    coordinates = []

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

        geometry = data.get(
            "geometry"
        )

        if geometry is not None:

            segment = [
                [
                    float(x),
                    float(y),
                ]
                for x, y
                in geometry.coords
            ]

        else:

            segment = [
                [
                    float(
                        G.nodes[u]["x"]
                    ),
                    float(
                        G.nodes[u]["y"]
                    ),
                ],
                [
                    float(
                        G.nodes[v]["x"]
                    ),
                    float(
                        G.nodes[v]["y"]
                    ),
                ],
            ]

        ux = float(
            G.nodes[u]["x"]
        )

        uy = float(
            G.nodes[u]["y"]
        )

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

        if (
            coordinates
            and segment
            and coordinates[-1]
            == segment[0]
        ):
            segment = segment[1:]

        coordinates.extend(
            segment
        )

    return coordinates


def _route_edge_data(
    G,
    route,
    weight_attribute,
):

    for u, v in zip(
        route[:-1],
        route[1:],
    ):

        yield _best_edge_data(
            G,
            u,
            v,
            weight_attribute,
        )


def _physical_distance(
    G,
    route,
    weight_attribute,
):

    total = 0.0

    for data in _route_edge_data(
        G,
        route,
        weight_attribute,
    ):

        total += float(
            data.get(
                "length",
                0.0,
            )
        )

    return total


def _routing_cost(
    G,
    route,
    weight_attribute,
):

    total = 0.0

    for data in _route_edge_data(
        G,
        route,
        weight_attribute,
    ):

        value = data.get(
            weight_attribute,
            data.get(
                "length",
                0.0,
            ),
        )

        total += float(
            value
        )

    return total


def _route_safety_stats(
    G,
    route,
    weight_attribute,
):

    crash_edges = 0
    crash_count_total = 0

    total_length = 0.0

    weighted_risk = 0.0
    weighted_coverage = 0.0

    max_edge_risk = 0.0

    for data in _route_edge_data(
        G,
        route,
        weight_attribute,
    ):

        length = float(
            data.get(
                "length",
                0.0,
            )
        )

        risk = float(
            data.get(
                "pedestrian_risk",
                0.0,
            )
        )

        coverage = float(
            data.get(
                "safety_data_coverage",
                0.0,
            )
        )

        crash_count = int(
            float(
                data.get(
                    "crash_count",
                    0,
                )
            )
        )

        if crash_count > 0:
            crash_edges += 1

        crash_count_total += (
            crash_count
        )

        max_edge_risk = max(
            max_edge_risk,
            risk,
        )

        weighted_risk += (
            risk
            * length
        )

        weighted_coverage += (
            coverage
            * length
        )

        total_length += length

    if total_length > 0:

        average_risk = (
            weighted_risk
            / total_length
        )

        average_coverage = (
            weighted_coverage
            / total_length
        )

    else:

        average_risk = 0.0
        average_coverage = 0.0

    route_safety_score = (
        100.0
        * (
            1.0
            - average_risk
        )
    )

    route_safety_score = max(
        0.0,
        min(
            100.0,
            route_safety_score,
        ),
    )

    return {
        "route_safety_score":
            round(
                route_safety_score,
                1,
            ),

        "average_route_risk":
            round(
                average_risk,
                3,
            ),

        "max_edge_risk":
            round(
                max_edge_risk,
                3,
            ),

        "crash_edges":
            crash_edges,

        "crash_count_total":
            crash_count_total,

        "safety_data_coverage":
            round(
                average_coverage,
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

    if (
        weight_attribute
        not in VALID_WEIGHTS
    ):

        raise ValueError(
            "Unsupported routing weight: "
            f"{weight_attribute}"
        )

    if (
        weight_attribute
        == "safety_weight"
    ):

        missing = sum(
            1
            for _, _, _, data
            in G.edges(
                keys=True,
                data=True,
            )
            if "safety_weight"
            not in data
        )

        if missing:

            raise ValueError(
                f"{missing} edges are "
                "missing safety_weight."
            )

    start_node = (
        ox.distance.nearest_nodes(
            G,
            X=start_lon,
            Y=start_lat,
        )
    )

    end_node = (
        ox.distance.nearest_nodes(
            G,
            X=end_lon,
            Y=end_lat,
        )
    )

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
            "No pedestrian route "
            "could be found between "
            "these locations."
        ) from exc

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

    safety_stats = (
        _route_safety_stats(
            G,
            route,
            weight_attribute,
        )
    )

    routing_mode = (
        "fastest"
        if weight_attribute
        == "length"
        else "safest"
    )

    properties = {
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

        **safety_stats,
    }

    return {
        "start_node":
            int(start_node),

        "end_node":
            int(end_node),

        "routing_mode":
            routing_mode,

        "weight":
            weight_attribute,

        "distance_m":
            round(
                distance_m,
                1,
            ),

        "distance_miles":
            round(
                distance_m
                / 1609.344,
                3,
            ),

        "estimated_walk_minutes":
            round(
                distance_m
                / 1.4
                / 60.0,
                1,
            ),

        "routing_cost":
            round(
                routing_cost,
                2,
            ),

        **safety_stats,

        "node_count":
            len(route),

        "coordinates":
            coordinates,

        "geojson": {
            "type":
                "Feature",

            "properties":
                properties,

            "geometry": {
                "type":
                    "LineString",

                "coordinates":
                    coordinates,
            },
        },
    }