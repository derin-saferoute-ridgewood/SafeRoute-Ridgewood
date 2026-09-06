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
    version="0.2.0",
)


@app.get("/")
def root():
    """
    Basic API information.
    """

    return {
        "name":
            "SafeRoute Ridgewood",

        "status":
            "running",

        "routing_modes": [
            "shortest",
            "crash_aware",
        ],
    }


@app.get("/health")
def health():
    """
    Check whether both routing graphs
    are available and load correctly.
    """

    result = {
        "ok": True,
        "modes": {},
    }

    for mode in [
        "shortest",
        "crash_aware",
    ]:

        graph_path = graph_path_for_mode(
            mode
        )

        # Graph file missing
        if not graph_path.exists():

            result["ok"] = False

            result["modes"][mode] = {
                "available": False,
                "graph":
                    str(graph_path),
            }

            continue

        try:
            G = load_graph(mode)

            if mode == "shortest":

                weight_attribute = (
                    "length"
                )

            else:

                weight_attribute = (
                    "final_weight"
                )

            result["modes"][mode] = {
                "available": True,

                "graph":
                    graph_path.name,

                "nodes":
                    G.number_of_nodes(),

                "edges":
                    G.number_of_edges(),

                "weight":
                    weight_attribute,
            }

        except Exception as exc:

            result["ok"] = False

            result["modes"][mode] = {
                "available": False,
                "error": str(exc),
            }

    return result


@app.post("/route")
def route(
    request: RouteRequest,
):
    """
    Calculate either:

    shortest
        -> weight = length

    crash_aware
        -> weight = final_weight
    """

    try:

        # ------------------------------------------
        # Load graph matching requested mode
        # ------------------------------------------

        G = load_graph(
            request.mode
        )

        # ------------------------------------------
        # Choose routing weight
        # ------------------------------------------

        if request.mode == "shortest":

            weight_attribute = (
                "length"
            )

        elif request.mode == "crash_aware":

            weight_attribute = (
                "final_weight"
            )

        else:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported "
                    "routing mode."
                ),
            )

        # ------------------------------------------
        # Calculate route
        # ------------------------------------------

        result = (
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

        return result

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

    except HTTPException:

        raise

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc