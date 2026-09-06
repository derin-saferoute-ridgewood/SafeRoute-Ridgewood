from backend.app.graph_data import load_graph
from backend.app.routing import get_shortest_walking_route

# Example Ridgewood-area points. Replace with any two verified Ridgewood coordinates.
START = (40.9868, -74.1202)
END = (40.9799, -74.1161)


def main():
    G = load_graph()
    result = get_shortest_walking_route(
        G,
        start_lat=START[0],
        start_lon=START[1],
        end_lat=END[0],
        end_lon=END[1],
    )
    print("Distance (m):", result["distance_m"])
    print("Distance (mi):", result["distance_miles"])
    print("Walk minutes:", result["estimated_walk_minutes"])
    print("Route nodes:", result["node_count"])
    print("Coordinate points:", len(result["coordinates"]))


if __name__ == "__main__":
    main()
