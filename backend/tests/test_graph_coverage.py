from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_coverage_endpoint_returns_nodes_and_edges():
    response = client.get('/coverage')

    assert response.status_code == 200, response.text

    payload = response.json()
    assert 'nodes' in payload
    assert 'edges' in payload
    assert isinstance(payload['nodes'], list)
    assert isinstance(payload['edges'], list)
    assert payload['nodes']
    assert payload['edges']

    first_node = payload['nodes'][0]
    assert {'id', 'lat', 'lon'} <= set(first_node)

    first_edge = payload['edges'][0]
    assert isinstance(first_edge, list)
    assert len(first_edge) >= 2
