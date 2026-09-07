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


def main():

    print()
    print("=" * 70)
    print("SAFEROUTE PHASE 3 FINAL GRAPH AUDIT")
    print("=" * 70)

    if not GRAPH_PATH.exists():

        raise FileNotFoundError(
            GRAPH_PATH
        )

    G = ox.load_graphml(
        GRAPH_PATH
    )

    nodes = (
        G.number_of_nodes()
    )

    edges = (
        G.number_of_edges()
    )

    missing = 0
    invalid = 0
    crash_edges = 0
    risky_edges = 0

    risk_values = []
    coverage_values = []

    for u, v, key, data in G.edges(
        keys=True,
        data=True,
    ):

        for field in REQUIRED_FIELDS:

            if field not in data:

                missing += 1

                print(
                    "Missing:",
                    field,
                    "on",
                    u,
                    v,
                    key,
                )

        if any(
            field not in data
            for field in REQUIRED_FIELDS
        ):

            continue

        length = float(
            data["length"]
        )

        crash_count = int(
            float(
                data["crash_count"]
            )
        )

        crash_score = float(
            data[
                "crash_severity_score"
            ]
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

        if crash_count > 0:
            crash_edges += 1

        if risk > 0:
            risky_edges += 1

        risk_values.append(
            risk
        )

        coverage_values.append(
            coverage
        )

        if length <= 0:
            invalid += 1

        if not (
            0
            <= crash_score
            <= 1
        ):
            invalid += 1

        if not (
            0
            <= risk
            <= 1
        ):
            invalid += 1

        if not (
            0
            <= safety_score
            <= 100
        ):
            invalid += 1

        if not (
            0
            <= coverage
            <= 1
        ):
            invalid += 1

        if (
            safety_weight
            < length
        ):
            invalid += 1

    average_risk = (
        sum(risk_values)
        / len(risk_values)
        if risk_values
        else 0
    )

    average_coverage = (
        sum(coverage_values)
        / len(coverage_values)
        if coverage_values
        else 0
    )

    print()
    print(
        "Nodes:",
        nodes,
    )

    print(
        "Edges:",
        edges,
    )

    print(
        "Crash-weighted edges:",
        crash_edges,
    )

    print(
        "Edges with non-zero risk:",
        risky_edges,
    )

    print(
        "Average edge risk:",
        round(
            average_risk,
            4,
        ),
    )

    print(
        "Average data coverage:",
        round(
            average_coverage,
            4,
        ),
    )

    print(
        "Missing attributes:",
        missing,
    )

    print(
        "Invalid values:",
        invalid,
    )

    if (
        nodes == 0
        or edges == 0
        or missing > 0
        or invalid > 0
    ):

        print()
        print(
            "FINAL AUDIT: FAIL"
        )

        raise SystemExit(1)

    print()
    print(
        "FINAL AUDIT: PASS"
    )


if __name__ == "__main__":
    main()