import networkx as nx

from fastapi import (
    FastAPI,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware

from backend.app.graph_data import (
    graph_path_for_mode,
    load_graph,
)

from backend.app.routing import (
    get_shortest_walking_route,
    snap_point_to_graph,
)

from backend.app.schemas import (
    RouteRequest,
    SnapRequest,
)


app = FastAPI(
    title="SafeRoute Ridgewood API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.app\.github\.dev$|https://.*\.github\.dev$|http://localhost:\d+$|http://127\.0\.0\.1:\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():

    return {
        "name":
            "SafeRoute Ridgewood",

        "status":
            "running",

        "routing_modes": [
            "fastest",
            "safest",
        ],
    }


@app.get("/health")
def health():

    result = {
        "ok": True,
        "modes": {},
        "crash_datasets": {},
    }

    for mode in [
        "fastest",
        "safest",
    ]:

        try:

            graph_path = (
                graph_path_for_mode(
                    mode
                )
            )

            G = load_graph(
                mode
            )

            weight = (
                "length"
                if mode
                == "fastest"
                else
                "safety_weight"
            )

            result[
                "modes"
            ][mode] = {
                "available":
                    True,

                "graph":
                    graph_path.name,

                "nodes":
                    G.number_of_nodes(),

                "edges":
                    G.number_of_edges(),

                "weight":
                    weight,
            }

        except Exception as exc:

            result["ok"] = False

            result[
                "modes"
            ][mode] = {
                "available":
                    False,

                "error":
                    str(exc),
            }

    for crash_dataset in [
        "low",
        "high",
        "unverified",
    ]:

        try:

            graph_path = graph_path_for_mode(
                "safest",
                crash_dataset,
            )

            G = load_graph(
                "safest",
                crash_dataset,
            )

            result["crash_datasets"][crash_dataset] = {
                "available": True,
                "graph": graph_path.name,
                "nodes": G.number_of_nodes(),
                "edges": G.number_of_edges(),
                "source": G.graph.get("crash_data_source"),
                "quality": G.graph.get("crash_data_quality"),
                "matched_records": G.graph.get("crash_data_matched_records"),
            }

        except Exception as exc:

            result["ok"] = False

            result["crash_datasets"][crash_dataset] = {
                "available": False,
                "error": str(exc),
            }

    return result


@app.get("/coverage")
def coverage():
    G = load_graph("fastest")

    nodes = []
    for node_id, data in G.nodes(data=True):
        x_value = data.get("x")
        y_value = data.get("y")
        if x_value is None or y_value is None:
            continue

        nodes.append(
            {
                "id": int(node_id),
                "lat": float(y_value),
                "lon": float(x_value),
            }
        )

    edges = []
    for u, v, _, data in G.edges(keys=True, data=True):
        geometry = data.get("geometry")

        if geometry is not None:
            coords = [[float(lon), float(lat)] for lon, lat in geometry.coords]
        else:
            x1 = float(G.nodes[u]["x"])
            y1 = float(G.nodes[u]["y"])
            x2 = float(G.nodes[v]["x"])
            y2 = float(G.nodes[v]["y"])
            coords = [[x1, y1], [x2, y2]]

        edges.append(coords)

    return {
        "nodes": nodes,
        "edges": edges,
        "count": {
            "nodes": len(nodes),
            "edges": len(edges),
        },
    }


@app.post("/snap")
def snap_point(
    request: SnapRequest,
):

    try:
        G = load_graph("fastest")
        snapped = snap_point_to_graph(
            G,
            request.lat,
            request.lon,
        )
        return snapped

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc


@app.post("/route")
def route(
    request: RouteRequest,
):

    try:

        G = load_graph(
            request.mode,
            request.crash_dataset,
        )

        if (
            request.mode
            == "fastest"
        ):

            weight_attribute = (
                "length"
            )

        else:

            weight_attribute = (
                "safety_weight"
            )

        return (
            get_shortest_walking_route(
                G=G,

                start_lat=
                    request.start_lat,

                start_lon=
                    request.start_lon,

                end_lat=
                    request.end_lat,

                end_lon=
                    request.end_lon,

                weight_attribute=
                    weight_attribute,
            )
        )

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except nx.NetworkXNoPath as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc