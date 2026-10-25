import pytest

from backend.app.graph_data import load_graph
from backend.app.routing import snap_point_to_graph


def test_snap_point_to_graph_validates_nearby_road():
    G = load_graph("fastest")

    snapped = snap_point_to_graph(G, 40.9622, -74.1057)

    assert snapped["valid"] is True
    assert snapped["distance_m"] >= 0
    assert -90 <= snapped["lat"] <= 90
    assert -180 <= snapped["lon"] <= 180


def test_snap_point_to_graph_rejects_far_from_road():
    G = load_graph("fastest")

    with pytest.raises(ValueError, match="road|nearby|place a dot"):
        snap_point_to_graph(G, 40.1000, -74.9000, max_distance_m=50)
