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


G = ox.load_graphml(
    GRAPH_PATH
)


rows = []


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

    if crash_count <= 0:
        continue

    rows.append(
        {
            "street":
                data.get(
                    "name",
                    "Unnamed",
                ),

            "u":
                u,

            "v":
                v,

            "key":
                k,

            "length":
                round(
                    float(
                        data.get(
                            "length",
                            0,
                        )
                    ),
                    1,
                ),

            "crash_count":
                crash_count,

            "crash_score":
                round(
                    float(
                        data.get(
                            "crash_score",
                            0,
                        )
                    ),
                    3,
                ),

            "final_weight":
                round(
                    float(
                        data.get(
                            "final_weight",
                            0,
                        )
                    ),
                    1,
                ),
        }
    )


rows.sort(
    key=lambda row: (
        row[
            "crash_count"
        ],
        row[
            "final_weight"
        ],
    ),
    reverse=True,
)


print()
print(
    "Top crash-weighted "
    "road edges"
)

print(
    "=" * 75
)


for row in rows[:30]:

    print(
        f"{row['street']}"
    )

    print(
        f"  length: "
        f"{row['length']} m"
    )

    print(
        f"  crash_count: "
        f"{row['crash_count']}"
    )

    print(
        f"  crash_score: "
        f"{row['crash_score']}"
    )

    print(
        f"  final_weight: "
        f"{row['final_weight']}"
    )

    print()