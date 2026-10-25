from backend.app.graph_data import graph_path_for_mode, load_graph
from backend.scripts.crash_street_matching import (
    load_normalized_street_aliases,
    street_name_candidates,
)


def _crash_total(graph):
    return sum(
        int(float(data.get("crash_count", 0)))
        for _, _, _, data in graph.edges(keys=True, data=True)
    )


def test_crash_graphs_use_increasing_datasets_and_same_osm_network():
    low_graph = load_graph("safest", "low")
    high_graph = load_graph("safest", "high")
    unverified_graph = load_graph("safest", "unverified")

    assert graph_path_for_mode("safest", "low").name == "ridgewood_safety_weighted.graphml"
    assert graph_path_for_mode("safest", "high").name == "ridgewood_safety2.graphml"
    assert graph_path_for_mode("safest", "unverified").name == "ridgewood_safety3.graphml"
    assert low_graph.number_of_nodes() == high_graph.number_of_nodes()
    assert low_graph.number_of_edges() == high_graph.number_of_edges()
    assert high_graph.number_of_nodes() == unverified_graph.number_of_nodes()
    assert high_graph.number_of_edges() == unverified_graph.number_of_edges()
    assert _crash_total(high_graph) > _crash_total(low_graph)
    assert _crash_total(unverified_graph) > _crash_total(high_graph)
    assert unverified_graph.graph["crash_data_source"] == "Crash_Ridgewood_Street_Inferred_Geopoints.csv"
    assert unverified_graph.graph["crash_data_quality"] == "unverified"
    assert unverified_graph.graph["crash_data_matched_records"] > 0
    assert all(
        "safety_weight" in data and "pedestrian_risk" in data
        for _, _, _, data in unverified_graph.edges(keys=True, data=True)
    )


def test_crash_street_names_normalize_to_existing_osm_labels():
    aliases, _ = load_normalized_street_aliases(
        graph_path_for_mode("safest").parent
        / "SafeRoute_Ridgewood_Pedestrian_Crashes_Normalized.csv"
    )

    assert street_name_candidates("E RIDGEWOOD AVE") == ["east ridgewood avenue"]
    assert street_name_candidates(
        "Godwin Avenue (BERGEN COUNTY 80 1)",
        aliases,
    ) == ["godwin avenue"]
    assert street_name_candidates(
        "Rt 507 (South Maple Avenue)",
        aliases,
    ) == ["south maple avenue"]
