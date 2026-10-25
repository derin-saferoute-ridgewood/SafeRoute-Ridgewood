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

SAFETY2_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_safety2.graphml"
)

SAFETY3_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_safety3.graphml"
)

GRAPH_PATHS = {
    "low": SAFETY_GRAPH_PATH,
    "high": SAFETY2_GRAPH_PATH,
    "unverified": SAFETY3_GRAPH_PATH,
}


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

    for field in (
        "crash_data_matched_records",
        "crash_data_skipped_unmatched_street",
        "crash_data_skipped_distant",
    ):
        value = G.graph.get(field)
        if value not in (None, ""):
            G.graph[field] = int(float(value))

    return G


@lru_cache(maxsize=6)
def load_graph(
    mode: str = "fastest",
    crash_dataset: str = "low",
):
    """
    Both routing modes use the graph selected by crash dataset.

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

    if crash_dataset not in GRAPH_PATHS:
        raise ValueError(
            f"Unsupported crash dataset: {crash_dataset}"
        )

    graph_path = GRAPH_PATHS[crash_dataset]

    if not graph_path.exists():
        build_commands = {
            "low": "python -m backend.scripts.build_safety_graph",
            "high": (
                "python -m backend.scripts.build_safety_graph "
                "--crash-csv backend/data/Crash.csv "
                "--output backend/data/ridgewood_safety2.graphml "
                "--match-street-names"
            ),
            "unverified": (
                "python -m backend.scripts.build_safety_graph "
                "--crash-csv backend/data/Crash_Ridgewood_Street_Inferred_Geopoints.csv "
                "--output backend/data/ridgewood_safety3.graphml "
                "--match-street-names "
                "--latitude-column latitude_final "
                "--longitude-column longitude_final "
                "--street-name-column streetname_osm_candidate "
                "--unverified"
            ),
        }

        raise FileNotFoundError(
            f"The {crash_dataset} crash-data graph has not been built. "
            f"Expected: {graph_path}. "
            f"Run: {build_commands[crash_dataset]}"
        )

    G = ox.load_graphml(
        graph_path
    )

    return _convert_graph_types(
        G
    )


def graph_path_for_mode(
    mode: str,
    crash_dataset: str = "low",
) -> Path:

    if mode not in {
        "fastest",
        "safest",
    }:

        raise ValueError(
            f"Unsupported routing mode: {mode}"
        )

    if crash_dataset not in GRAPH_PATHS:
        raise ValueError(
            f"Unsupported crash dataset: {crash_dataset}"
        )

    return GRAPH_PATHS[crash_dataset]


def clear_graph_cache():
    """
    Useful after regenerating the graph
    while developing.
    """

    load_graph.cache_clear()