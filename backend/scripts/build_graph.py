from pathlib import Path
import osmnx as ox

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "backend" / "data"
OUTPUT = DATA_DIR / "ridgewood_walk.graphml"

# Keep future-use OSM fields now so Phase 2 does not require rebuilding the graph.
EXTRA_WAY_TAGS = [
    "sidewalk", "sidewalk:left", "sidewalk:right",
    "maxspeed", "lanes", "surface", "smoothness",
    "lit", "incline", "wheelchair", "foot", "access",
    "crossing", "crossing:signals", "tactile_paving", "kerb",
]
EXTRA_NODE_TAGS = [
    "highway", "crossing", "crossing:signals", "tactile_paving",
    "kerb", "barrier", "wheelchair",
]


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    ox.settings.useful_tags_way = list(
        dict.fromkeys(ox.settings.useful_tags_way + EXTRA_WAY_TAGS)
    )
    ox.settings.useful_tags_node = list(
        dict.fromkeys(ox.settings.useful_tags_node + EXTRA_NODE_TAGS)
    )

    print("Downloading Ridgewood, NJ pedestrian network from OpenStreetMap...")
    G = ox.graph.graph_from_place(
        "Ridgewood, Bergen County, New Jersey, USA",
        network_type="walk",
        simplify=True,
        retain_all=False,
        truncate_by_edge=True,
    )

    # Phase 1 routing uses ONLY length. Walking-time fields are informational.
    for _, _, _, data in G.edges(keys=True, data=True):
        length = float(data.get("length", 0.0))
        data["walk_speed_mps"] = 1.4
        data["walk_time_s"] = length / 1.4 if length > 0 else 0.0

    ox.io.save_graphml(G, OUTPUT)
    print(f"Saved: {OUTPUT}")
    print(f"Nodes: {len(G.nodes):,}")
    print(f"Edges: {len(G.edges):,}")


if __name__ == "__main__":
    main()
