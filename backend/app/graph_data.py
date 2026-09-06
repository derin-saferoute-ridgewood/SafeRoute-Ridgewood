from pathlib import Path
import osmnx as ox

ROOT = Path(__file__).resolve().parents[2]
GRAPH_PATH = ROOT / "backend" / "data" / "ridgewood_walk.graphml"


def load_graph():
    if not GRAPH_PATH.exists():
        raise FileNotFoundError(
            f"Missing {GRAPH_PATH}. Run: python backend/scripts/build_graph.py"
        )
    return ox.io.load_graphml(GRAPH_PATH)
