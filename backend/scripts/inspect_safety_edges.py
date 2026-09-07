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


G = ox.load_graphml(
    GRAPH_PATH
)


rows = []


for _, _, _, data in G.edges(
    keys=True,
    data=True,
):

    rows.append(
        {
            "street":
                data.get(
                    "name",
                    "Unnamed",
                ),

            "length":
                float(
                    data.get(
                        "length",
                        0.0,
                    )
                ),

            "crash_count":
                int(
                    float(
                        data.get(
                            "crash_count",
                            0,
                        )
                    )
                ),

            "crash":
                float(
                    data.get(
                        "crash_severity_score",
                        0.0,
                    )
                ),

            "speed":
                float(
                    data.get(
                        "speed_score",
                        0.0,
                    )
                ),

            "speed_known":
                int(
                    float(
                        data.get(
                            "speed_known",
                            0,
                        )
                    )
                ),

            "sidewalk":
                float(
                    data.get(
                        "sidewalk_score",
                        0.0,
                    )
                ),

            "sidewalk_known":
                int(
                    float(
                        data.get(
                            "sidewalk_known",
                            0,
                        )
                    )
                ),

            "crossing":
                float(
                    data.get(
                        "crossing_score",
                        0.0,
                    )
                ),

            "crossing_known":
                int(
                    float(
                        data.get(
                            "crossing_known",
                            0,
                        )
                    )
                ),

            "risk":
                float(
                    data.get(
                        "pedestrian_risk",
                        0.0,
                    )
                ),

            "score":
                float(
                    data.get(
                        "pedestrian_safety_score",
                        100.0,
                    )
                ),

            "coverage":
                float(
                    data.get(
                        "safety_data_coverage",
                        0.0,
                    )
                ),

            "weight":
                float(
                    data.get(
                        "safety_weight",
                        0.0,
                    )
                ),
        }
    )


rows.sort(
    key=lambda row:
        row["risk"],
    reverse=True,
)


print()
print(
    "HIGHEST-RISK RIDGEWOOD EDGES"
)

print(
    "=" * 70
)


for row in rows[:30]:

    print(
        row["street"]
    )

    print(
        "  length:",
        round(
            row["length"],
            1,
        ),
        "m",
    )

    print(
        "  crash severity:",
        round(
            row["crash"],
            3,
        ),
    )

    print(
        "  speed:",
        (
            round(
                row["speed"],
                3,
            )
            if row[
                "speed_known"
            ]
            else "unknown"
        ),
    )

    print(
        "  sidewalk:",
        (
            round(
                row[
                    "sidewalk"
                ],
                3,
            )
            if row[
                "sidewalk_known"
            ]
            else "unknown"
        ),
    )

    print(
        "  crossing:",
        (
            round(
                row[
                    "crossing"
                ],
                3,
            )
            if row[
                "crossing_known"
            ]
            else "unknown"
        ),
    )

    print(
        "  pedestrian risk:",
        round(
            row["risk"],
            3,
        ),
    )

    print(
        "  safety score:",
        round(
            row["score"],
            1,
        ),
        "/ 100",
    )

    print(
        "  data coverage:",
        round(
            row["coverage"],
            3,
        ),
    )

    print(
        "  safety weight:",
        round(
            row["weight"],
            1,
        ),
    )

    print()