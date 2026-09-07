from backend.app.graph_data import load_graph
from backend.app.routing import get_shortest_walking_route


TEST_ROUTES = [
    {
        "name": "Downtown test",
        "start_lat": 40.9827,
        "start_lon": -74.1178,
        "end_lat": 40.9810,
        "end_lon": -74.1128,
    },
    {
        "name": "North to downtown",
        "start_lat": 40.9915,
        "start_lon": -74.1190,
        "end_lat": 40.9822,
        "end_lon": -74.1162,
    },
    {
        "name": "West to east",
        "start_lat": 40.9850,
        "start_lon": -74.1300,
        "end_lat": 40.9840,
        "end_lon": -74.1055,
    },
    {
        "name": "South to downtown",
        "start_lat": 40.9728,
        "start_lon": -74.1180,
        "end_lat": 40.9818,
        "end_lon": -74.1160,
    },
    {
        "name": "East Ridgewood test",
        "start_lat": 40.9845,
        "start_lon": -74.1030,
        "end_lat": 40.9815,
        "end_lon": -74.1155,
    },
]


MAX_REASONABLE_DETOUR_PERCENT = 30.0


def calculate_route(
    G,
    test,
    weight,
):
    return get_shortest_walking_route(
        G,
        start_lat=test["start_lat"],
        start_lon=test["start_lon"],
        end_lat=test["end_lat"],
        end_lon=test["end_lon"],
        weight_attribute=weight,
    )


def main():
    print()
    print("=" * 76)
    print("SAFEROUTE RIDGEWOOD — PHASE 3 ACCEPTANCE TEST")
    print("=" * 76)

    G = load_graph("fastest")

    passed = 0
    warnings = 0
    failed = 0

    for test in TEST_ROUTES:

        print()
        print("-" * 76)
        print(test["name"])
        print("-" * 76)

        try:

            fastest = calculate_route(
                G,
                test,
                "length",
            )

            safest = calculate_route(
                G,
                test,
                "safety_weight",
            )

        except Exception as exc:

            failed += 1

            print(
                "FAIL: routing exception:",
                exc,
            )

            continue

        fastest_distance = (
            fastest["distance_m"]
        )

        safest_distance = (
            safest["distance_m"]
        )

        if fastest_distance > 0:

            detour_percent = (
                (
                    safest_distance
                    - fastest_distance
                )
                / fastest_distance
                * 100.0
            )

        else:

            detour_percent = 0.0

        safety_improvement = (
            safest["route_safety_score"]
            - fastest["route_safety_score"]
        )

        same_route = (
            fastest["coordinates"]
            ==
            safest["coordinates"]
        )

        print(
            "Fastest distance:",
            fastest_distance,
            "m",
        )

        print(
            "Safest distance:",
            safest_distance,
            "m",
        )

        print(
            "Detour:",
            round(
                detour_percent,
                1,
            ),
            "%",
        )

        print(
            "Fastest safety:",
            fastest[
                "route_safety_score"
            ],
        )

        print(
            "Safest safety:",
            safest[
                "route_safety_score"
            ],
        )

        print(
            "Safety improvement:",
            round(
                safety_improvement,
                1,
            ),
        )

        print(
            "Same route:",
            same_route,
        )

        print(
            "Fastest crash edges:",
            fastest[
                "crash_edges"
            ],
        )

        print(
            "Safest crash edges:",
            safest[
                "crash_edges"
            ],
        )

        print(
            "Fastest data coverage:",
            fastest[
                "safety_data_coverage"
            ],
        )

        print(
            "Safest data coverage:",
            safest[
                "safety_data_coverage"
            ],
        )

        if (
            safest_distance <= 0
            or fastest_distance <= 0
        ):

            failed += 1

            print(
                "FAIL: invalid distance."
            )

            continue

        if (
            safest["route_safety_score"]
            < 0
            or safest["route_safety_score"]
            > 100
        ):

            failed += 1

            print(
                "FAIL: safety score "
                "outside 0–100."
            )

            continue

        if (
            detour_percent
            > MAX_REASONABLE_DETOUR_PERCENT
        ):

            warnings += 1

            print(
                "WARNING: Safest is more "
                "than 30% longer."
            )

            continue

        passed += 1

        print(
            "PASS"
        )

    print()
    print("=" * 76)
    print("FINAL RESULTS")
    print("=" * 76)

    print(
        "Passed:",
        passed,
    )

    print(
        "Warnings:",
        warnings,
    )

    print(
        "Failed:",
        failed,
    )

    if failed > 0:

        print()
        print(
            "PHASE 3 ACCEPTANCE: FAIL"
        )

        raise SystemExit(1)

    print()
    print(
        "PHASE 3 ACCEPTANCE: PASS"
    )


if __name__ == "__main__":
    main()