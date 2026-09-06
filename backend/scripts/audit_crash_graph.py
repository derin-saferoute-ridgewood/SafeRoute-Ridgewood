from pathlib import Path

import osmnx as ox


BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

GRAPH_PATH = (
    BASE_DIR
    / "data"
    / (
        "ridgewood_crash_"
        "weighted.graphml"
    )
)


if not GRAPH_PATH.exists():

    raise FileNotFoundError(
        f"Missing weighted graph: "
        f"{GRAPH_PATH}"
    )


G = ox.load_graphml(
    GRAPH_PATH
)


required_fields = [
    "length",
    "crash_count",
    "crash_score",
    "final_weight",
]


missing_attributes = 0

invalid_weights = 0

edges_with_crashes = 0

maximum_crash_count = 0


for u, v, k, data in G.edges(
    keys=True,
    data=True,
):

    for field in required_fields:

        if field not in data:

            missing_attributes += 1

            print(
                "Missing",
                field,
                "on edge",
                u,
                v,
                k,
            )

    length = float(
        data.get(
            "length",
            0,
        )
    )

    final_weight = float(
        data.get(
            "final_weight",
            0,
        )
    )

    crash_count = int(
        data.get(
            "crash_count",
            0,
        )
    )

    if final_weight < length:

        invalid_weights += 1

    if crash_count > 0:

        edges_with_crashes += 1

    maximum_crash_count = max(
        maximum_crash_count,
        crash_count,
    )


print()
print(
    "Nodes:",
    G.number_of_nodes(),
)

print(
    "Edges:",
    G.number_of_edges(),
)

print(
    "Edges with crashes:",
    edges_with_crashes,
)

print(
    "Maximum crash count:",
    maximum_crash_count,
)

print(
    "Missing required attributes:",
    missing_attributes,
)

print(
    "Invalid final weights:",
    invalid_weights,
)


if (
    missing_attributes == 0
    and invalid_weights == 0
):

    print()
    print(
        "PASS: crash-weighted "
        "graph is valid."
    )

else:

    print()
    print(
        "FAIL: weighted graph "
        "has problems."
    )

    raise SystemExit(1)