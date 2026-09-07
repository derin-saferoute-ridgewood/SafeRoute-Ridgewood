from backend.app.graph_data import (
    load_graph,
)

from backend.app.routing import (
    get_shortest_walking_route,
)


START_LAT = 40.9827
START_LON = -74.1178

END_LAT = 40.9810
END_LON = -74.1128


print()
print(
    "Loading safety graph..."
)

G = load_graph(
    "fastest"
)


print(
    "Calculating Fastest..."
)

fastest = (
    get_shortest_walking_route(
        G,

        start_lat=
            START_LAT,

        start_lon=
            START_LON,

        end_lat=
            END_LAT,

        end_lon=
            END_LON,

        weight_attribute=
            "length",
    )
)


print(
    "Calculating Safest..."
)

safest = (
    get_shortest_walking_route(
        G,

        start_lat=
            START_LAT,

        start_lon=
            START_LON,

        end_lat=
            END_LAT,

        end_lon=
            END_LON,

        weight_attribute=
            "safety_weight",
    )
)


def print_result(
    title,
    result,
):

    print()
    print(
        "=" * 65
    )

    print(
        title
    )

    print(
        "=" * 65
    )

    print(
        "Distance:",
        result[
            "distance_m"
        ],
        "m",
    )

    print(
        "Walking time:",
        result[
            "estimated_walk_minutes"
        ],
        "min",
    )

    print(
        "Safety score:",
        result[
            "route_safety_score"
        ],
    )

    print(
        "Average risk:",
        result[
            "average_route_risk"
        ],
    )

    print(
        "Max edge risk:",
        result[
            "max_edge_risk"
        ],
    )

    print(
        "Crash edges:",
        result[
            "crash_edges"
        ],
    )

    print(
        "Crash count:",
        result[
            "crash_count_total"
        ],
    )

    print(
        "Data coverage:",
        result[
            "safety_data_coverage"
        ],
    )

    print(
        "Routing cost:",
        result[
            "routing_cost"
        ],
    )


print_result(
    "FASTEST ROUTE",
    fastest,
)

print_result(
    "SAFEST ROUTE",
    safest,
)


same_route = (
    fastest[
        "coordinates"
    ]
    ==
    safest[
        "coordinates"
    ]
)


distance_difference = (
    safest[
        "distance_m"
    ]
    -
    fastest[
        "distance_m"
    ]
)


distance_percent = (
    100.0
    * distance_difference
    / fastest[
        "distance_m"
    ]
    if fastest[
        "distance_m"
    ] > 0
    else 0.0
)


safety_improvement = (
    safest[
        "route_safety_score"
    ]
    -
    fastest[
        "route_safety_score"
    ]
)


print()
print(
    "=" * 65
)

print(
    "COMPARISON"
)

print(
    "=" * 65
)


print(
    "Same route:",
    same_route,
)

print(
    "Extra distance:",
    round(
        distance_difference,
        1,
    ),
    "m",
)

print(
    "Distance increase:",
    round(
        distance_percent,
        1,
    ),
    "%",
)

print(
    "Safety improvement:",
    round(
        safety_improvement,
        1,
    ),
    "points",
)

print(
    "Crash-edge reduction:",
    fastest[
        "crash_edges"
    ]
    -
    safest[
        "crash_edges"
    ],
)


if (
    not same_route
    and safety_improvement > 0
):

    print()
    print(
        "PASS: Safest selected "
        "a different route with "
        "a higher safety score."
    )

elif same_route:

    print()
    print(
        "NOTE: Both modes chose "
        "the same route for this "
        "origin/destination."
    )

else:

    print()
    print(
        "WARNING: routes changed "
        "without improving the "
        "current safety metric."
    )