from functools import lru_cache
from pathlib import Path

import osmnx as ox


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

WALK_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_walk.graphml"
)

CRASH_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_crash_weighted.graphml"
)


def _convert_edge_types(G):
    """
    Convert custom GraphML attributes into
    numeric Python types after loading.
    """

    for _, _, _, data in G.edges(
        keys=True,
        data=True,
    ):

        if "length" in data:
            data["length"] = float(
                data["length"]
            )

        if "crash_count" in data:
            data["crash_count"] = int(
                float(
                    data["crash_count"]
                )
            )

        if "crash_score" in data:
            data["crash_score"] = float(
                data["crash_score"]
            )

        if "final_weight" in data:
            data["final_weight"] = float(
                data["final_weight"]
            )

    return G


@lru_cache(maxsize=2)
def load_graph(
    mode: str = "shortest",
):
    """
    Both routing modes use the weighted graph.

    shortest
        -> weight = length

    crash_aware
        -> weight = final_weight

    The untouched walking graph remains as
    the clean source/backup graph.
    """

    if mode not in {
        "shortest",
        "crash_aware",
    }:
        raise ValueError(
            f"Unsupported routing mode: {mode}"
        )

    graph_path = CRASH_GRAPH_PATH

    if not graph_path.exists():
        raise FileNotFoundError(
            f"Graph file does not exist: "
            f"{graph_path}"
        )

    G = ox.load_graphml(
        graph_path
    )

    return _convert_edge_types(G)


def graph_path_for_mode(
    mode: str,
) -> Path:

    if mode not in {
        "shortest",
        "crash_aware",
    }:
        raise ValueError(
            f"Unsupported routing mode: {mode}"
        )

    return CRASH_GRAPH_PATH