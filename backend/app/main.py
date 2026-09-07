import networkx as nx

from fastapi import (
    FastAPI,
    HTTPException,
)

from backend.app.graph_data import (
    graph_path_for_mode,
    load_graph,
)

from backend.app.routing import (
    get_shortest_walking_route,
)

from backend.app.schemas import (
    RouteRequest,
)


app = FastAPI(
    title="SafeRoute Ridgewood API",
    version="1.0.0",
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

    return result


@app.post("/route")
def route(
    request: RouteRequest,
):

    try:

        G = load_graph(
            request.mode
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