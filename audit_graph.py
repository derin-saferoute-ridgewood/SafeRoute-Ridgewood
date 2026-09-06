from backend.app.graph_data import load_graph


def main():
    G = load_graph()
    lengths = [float(d.get("length", 0.0)) for _, _, _, d in G.edges(keys=True, data=True)]
    missing_length = sum(1 for x in lengths if x <= 0)
    print("Graph loaded successfully")
    print("Nodes:", len(G.nodes))
    print("Edges:", len(G.edges))
    print("Edges missing positive length:", missing_length)
    print("CRS:", G.graph.get("crs"))
    print("PASS" if len(G.nodes) > 0 and len(G.edges) > 0 and missing_length == 0 else "CHECK GRAPH")


if __name__ == "__main__":
    main()
