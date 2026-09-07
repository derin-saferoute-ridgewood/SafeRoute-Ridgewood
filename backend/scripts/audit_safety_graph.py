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
    / "ridgewood_safety_weighted.graphml"
)


if not GRAPH_PATH.exists():

    raise FileNotFoundError(
        f"Missing graph: "
        f"{GRAPH_PATH}"
    )


G = ox.load_graphml(
    GRAPH_PATH
)


REQUIRED_FIELDS = [
    "length",

    "crash_count",
    "crash_severity_total",
    "crash_severity_score",

    "speed_score",
    "speed_known",

    "sidewalk_score",
    "sidewalk_known",

    "crossing_score",
    "crossing_known",

    "lighting_score",
    "lighting_known",

    "pedestrian_risk",
    "pedestrian_safety_score",
    "safety_data_coverage",

    "safety_weight",
]


missing = 0
invalid = 0


for u, v, key, data in G.edges(
    keys=True,
    data=True,
):

    for field in REQUIRED_FIELDS:

        if field not in data:

            missing += 1

            print(
                "Missing",
                field,
                "on",
                u,
                v,
                key,
            )


    if any(
        field not in data
        for field
        in REQUIRED_FIELDS
    ):

        continue


    length = float(
        data["length"]
    )

    risk = float(
        data[
            "pedestrian_risk"
        ]
    )

    safety_score = float(
        data[
            "pedestrian_safety_score"
        ]
    )

    coverage = float(
        data[
            "safety_data_coverage"
        ]
    )

    safety_weight = float(
        data[
            "safety_weight"
        ]
    )


    if not (
        0.0
        <= risk
        <= 1.0
    ):

        invalid += 1


    if not (
        0.0
        <= safety_score
        <= 100.0
    ):

        invalid += 1


    if not (
        0.0
        <= coverage
        <= 1.0
    ):

        invalid += 1


    if (
        safety_weight
        < length
    ):

        invalid += 1


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
    "Missing fields:",
    missing,
)

print(
    "Invalid values:",
    invalid,
)


if (
    missing == 0
    and invalid == 0
):

    print()
    print(
        "PASS: safety graph "
        "is valid."
    )

else:

    print()
    print(
        "FAIL: safety graph "
        "has errors."
    )

    raise SystemExit(1)