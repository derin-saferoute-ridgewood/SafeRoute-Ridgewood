from functools import lru_cache
from pathlib import Path

import osmnx as ox


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

BASE_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_walk.graphml"
)

SAFETY_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_safety_weighted.graphml"
)


FLOAT_FIELDS = {
    "length",
    "crash_severity_total",
    "crash_severity_score",
    "speed_mph",
    "speed_score",
    "sidewalk_score",
    "crossing_score",
    "lighting_score",
    "pedestrian_risk",
    "pedestrian_safety_score",
    "safety_data_coverage",
    "safety_weight",
}

INT_FIELDS = {
    "crash_count",
    "speed_known",
    "sidewalk_known",
    "crossing_known",
    "lighting_known",
}


def _convert_graph_types(G):
    """
    GraphML can reload custom numeric attributes
    as strings. Convert them here once.
    """

    for _, _, _, data in G.edges(
        keys=True,
        data=True,
    ):

        for field in FLOAT_FIELDS:

            if field not in data:
                continue

            value = data[field]

            if value in (
                None,
                "",
            ):
                continue

            data[field] = float(
                value
            )

        for field in INT_FIELDS:

            if field not in data:
                continue

            value = data[field]

            if value in (
                None,
                "",
            ):
                continue

            data[field] = int(
                float(value)
            )

    return G


@lru_cache(maxsize=1)
def load_graph(
    mode: str = "fastest",
):
    """
    Both routing modes use the exact same graph.

    fastest
        -> weight = length

    safest
        -> weight = safety_weight
    """

    if mode not in {
        "fastest",
        "safest",
    }:

        raise ValueError(
            f"Unsupported routing mode: {mode}"
        )

    if not SAFETY_GRAPH_PATH.exists():

        raise FileNotFoundError(
            "Safety graph has not been built. "
            f"Expected: {SAFETY_GRAPH_PATH}. "
            "Run: "
            "python -m backend.scripts.build_safety_graph"
        )

    G = ox.load_graphml(
        SAFETY_GRAPH_PATH
    )

    return _convert_graph_types(
        G
    )


def graph_path_for_mode(
    mode: str,
) -> Path:

    if mode not in {
        "fastest",
        "safest",
    }:

        raise ValueError(
            f"Unsupported routing mode: {mode}"
        )

    return SAFETY_GRAPH_PATH


def clear_graph_cache():
    """
    Useful after regenerating the graph
    while developing.
    """

    load_graph.cache_clear()