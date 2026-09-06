from backend.app.graph_data import load_graph
from backend.app.routing import get_shortest_walking_route


# --------------------------------------------------
# TEST COORDINATES
# --------------------------------------------------

START_LAT = 40.9827
START_LON = -74.1178

END_LAT = 40.9810
END_LON = -74.1128


# --------------------------------------------------
# IMPORTANT:
# Use the crash-weighted graph for BOTH routes.
#
# It contains:
#   length
#   crash_count
#   crash_score
#   final_weight
#
# Shortest routing still minimizes "length".
# Crash-aware routing minimizes "final_weight".
# --------------------------------------------------

print()
print("Loading crash-weighted graph...")

G = load_graph(
    "crash_aware"
)


# --------------------------------------------------
# SHORTEST ROUTE
# --------------------------------------------------

print(
    "Calculating shortest route..."
)

shortest = get_shortest_walking_route(
    G,

    start_lat=START_LAT,
    start_lon=START_LON,

    end_lat=END_LAT,
    end_lon=END_LON,

    weight_attribute="length",
)


# --------------------------------------------------
# CRASH-AWARE ROUTE
# --------------------------------------------------

print(
    "Calculating crash-aware route..."
)

crash_aware = get_shortest_walking_route(
    G,

    start_lat=START_LAT,
    start_lon=START_LON,

    end_lat=END_LAT,
    end_lon=END_LON,

    weight_attribute="final_weight",
)


# --------------------------------------------------
# SHORTEST RESULTS
# --------------------------------------------------

print()
print("=" * 60)
print("SHORTEST ROUTE")
print("=" * 60)

print(
    "Distance:",
    shortest["distance_m"],
    "m",
)

print(
    "Routing cost:",
    shortest["routing_cost"],
)

print(
    "Crash edges:",
    shortest["crash_edges"],
)

print(
    "Crash count total:",
    shortest["crash_count_total"],
)

print(
    "Max crash score:",
    shortest["max_crash_score"],
)

print(
    "Nodes:",
    shortest["node_count"],
)

print(
    "Coordinate points:",
    len(
        shortest["coordinates"]
    ),
)


# --------------------------------------------------
# CRASH-AWARE RESULTS
# --------------------------------------------------

print()
print("=" * 60)
print("CRASH-AWARE ROUTE")
print("=" * 60)

print(
    "Distance:",
    crash_aware["distance_m"],
    "m",
)

print(
    "Routing cost:",
    crash_aware["routing_cost"],
)

print(
    "Crash edges:",
    crash_aware["crash_edges"],
)

print(
    "Crash count total:",
    crash_aware[
        "crash_count_total"
    ],
)

print(
    "Max crash score:",
    crash_aware[
        "max_crash_score"
    ],
)

print(
    "Nodes:",
    crash_aware["node_count"],
)

print(
    "Coordinate points:",
    len(
        crash_aware["coordinates"]
    ),
)


# --------------------------------------------------
# COMPARISON
# --------------------------------------------------

same_route = (
    shortest["coordinates"]
    ==
    crash_aware["coordinates"]
)


distance_difference = (
    crash_aware["distance_m"]
    -
    shortest["distance_m"]
)


crash_edge_reduction = (
    shortest["crash_edges"]
    -
    crash_aware["crash_edges"]
)


crash_count_reduction = (
    shortest["crash_count_total"]
    -
    crash_aware[
        "crash_count_total"
    ]
)


print()
print("=" * 60)
print("COMPARISON")
print("=" * 60)

print(
    "Same exact route:",
    same_route,
)

print(
    "Crash-aware route "
    "distance difference:",
    round(
        distance_difference,
        1,
    ),
    "m",
)

print(
    "Crash-edge reduction:",
    crash_edge_reduction,
)

print(
    "Crash-count reduction:",
    crash_count_reduction,
)


# --------------------------------------------------
# INTERPRETATION
# --------------------------------------------------

print()

if same_route:

    print(
        "The two modes selected "
        "the same route."
    )

else:

    print(
        "SUCCESS: shortest and "
        "crash-aware routing selected "
        "different paths."
    )


if crash_edge_reduction > 0:

    print(
        "SUCCESS: crash-aware routing "
        "reduced the number of "
        "crash-weighted edges."
    )

elif crash_count_reduction > 0:

    print(
        "SUCCESS: crash-aware routing "
        "reduced total historical "
        "crash exposure."
    )

elif (
    crash_aware["max_crash_score"]
    <
    shortest["max_crash_score"]
):

    print(
        "SUCCESS: crash-aware routing "
        "reduced the maximum crash "
        "risk encountered."
    )

else:

    print(
        "NOTE: this trip changed route "
        "but did not reduce the simple "
        "crash-exposure metrics."
    )