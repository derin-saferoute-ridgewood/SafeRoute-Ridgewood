from pathlib import Path

import numpy as np
import osmnx as ox
import pandas as pd


BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

DATA_DIR = (
    BASE_DIR
    / "data"
)

GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_walk.graphml"
)

CRASH_PATH = (
    DATA_DIR
    / (
        "SafeRoute_Ridgewood_"
        "Pedestrian_Crashes_"
        "Normalized.csv"
    )
)

OUTPUT_PATH = (
    DATA_DIR
    / (
        "ridgewood_crash_"
        "weighted.graphml"
    )
)


# ==================================================
# TUNING VALUE
# ==================================================

CRASH_MULTIPLIER = 1.5


# ==================================================
# LOAD DATA
# ==================================================

print(
    "Loading base walking graph..."
)

G = ox.load_graphml(
    GRAPH_PATH
)

print(
    "Loading crash data..."
)

crashes = pd.read_csv(
    CRASH_PATH
)


# Normalize CSV column names.
crashes.columns = [
    str(column)
    .strip()
    .lower()
    for column
    in crashes.columns
]


required_columns = {
    "latitude",
    "longitude",
}

missing_columns = (
    required_columns
    - set(
        crashes.columns
    )
)

if missing_columns:

    raise ValueError(
        "Crash CSV is missing "
        f"required columns: "
        f"{missing_columns}"
    )


# ==================================================
# CLEAN COORDINATES
# ==================================================

crashes["latitude"] = (
    pd.to_numeric(
        crashes["latitude"],
        errors="coerce",
    )
)

crashes["longitude"] = (
    pd.to_numeric(
        crashes["longitude"],
        errors="coerce",
    )
)

crashes = (
    crashes.dropna(
        subset=[
            "latitude",
            "longitude",
        ]
    )
    .copy()
)


print(
    "Crash records with "
    "coordinates:",
    len(crashes),
)


if len(crashes) == 0:

    raise ValueError(
        "No crash records contain "
        "usable coordinates."
    )


# ==================================================
# INITIALIZE ALL EDGES
# ==================================================

for u, v, k, data in G.edges(
    keys=True,
    data=True,
):

    data[
        "crash_count"
    ] = 0


# ==================================================
# MATCH CRASHES TO EDGES
# ==================================================

print(
    "Matching crashes to "
    "nearest road edges..."
)

nearest_edges = (
    ox.distance.nearest_edges(
        G,

        X=crashes[
            "longitude"
        ].to_numpy(),

        Y=crashes[
            "latitude"
        ].to_numpy(),
    )
)


def add_reverse_crash(
    G,
    u,
    v,
    matched_data,
):
    """
    Add the crash to one corresponding
    reverse-direction edge when available.

    This avoids assigning one crash to
    every possible parallel reverse edge.
    """

    if not G.has_edge(v, u):
        return

    reverse_edges = (
        G.get_edge_data(
            v,
            u,
        )
    )

    if not reverse_edges:
        return

    matched_length = float(
        matched_data.get(
            "length",
            0.0,
        )
    )

    best_reverse_key = min(
        reverse_edges.keys(),

        key=lambda key: abs(
            float(
                reverse_edges[key].get(
                    "length",
                    matched_length,
                )
            )
            - matched_length
        ),
    )

    reverse_edges[
        best_reverse_key
    ][
        "crash_count"
    ] += 1


for edge in nearest_edges:

    u, v, k = edge

    matched_data = (
        G[u][v][k]
    )

    matched_data[
        "crash_count"
    ] += 1

    add_reverse_crash(
        G,
        u,
        v,
        matched_data,
    )


# ==================================================
# NORMALIZE CRASH COUNTS
# ==================================================

counts = np.array(
    [
        int(
            data.get(
                "crash_count",
                0,
            )
        )

        for _, _, _, data
        in G.edges(
            keys=True,
            data=True,
        )
    ],
    dtype=float,
)


max_count = max(
    float(
        counts.max()
    ),
    1.0,
)


print(
    "Maximum crash count "
    "on an edge:",
    int(max_count),
)


# ==================================================
# CALCULATE CRASH SCORE
# AND FINAL WEIGHT
# ==================================================

for u, v, k, data in G.edges(
    keys=True,
    data=True,
):

    crash_count = int(
        data.get(
            "crash_count",
            0,
        )
    )

    crash_score = (
        np.log1p(
            crash_count
        )
        /
        np.log1p(
            max_count
        )
    )

    crash_score = float(
        crash_score
    )

    data[
        "crash_score"
    ] = crash_score

    length = float(
        data.get(
            "length",
            1.0,
        )
    )

    final_weight = (
        length
        *
        (
            1.0
            +
            CRASH_MULTIPLIER
            *
            crash_score
        )
    )

    data[
        "final_weight"
    ] = float(
        final_weight
    )


# ==================================================
# STATISTICS
# ==================================================

weighted_edges = [
    data

    for _, _, _, data
    in G.edges(
        keys=True,
        data=True,
    )

    if int(
        data.get(
            "crash_count",
            0,
        )
    ) > 0
]


print(
    "Edges with crashes:",
    len(weighted_edges),
)

print(
    "Crash multiplier:",
    CRASH_MULTIPLIER,
)


# ==================================================
# SAVE
# ==================================================

ox.save_graphml(
    G,
    OUTPUT_PATH,
)

print(
    "Saved weighted graph:"
)

print(
    OUTPUT_PATH
)

print(
    "Crash weighting complete."
)