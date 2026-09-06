from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import networkx as nx

from backend.app.graph_data import load_graph
from backend.app.routing import get_shortest_walking_route
from backend.app.schemas import RouteRequest

app = FastAPI(title="SafeRoute+ Ridgewood Routing API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

G = load_graph()


@app.get("/health")
def health():
    return {
        "ok": True,
        "routing_mode": "shortest_walk",
        "weight": "length",
        "nodes": len(G.nodes),
        "edges": len(G.edges),
    }


@app.post("/route")
def route(req: RouteRequest):
    try:
        return get_shortest_walking_route(
            G,
            start_lat=req.start_lat,
            start_lon=req.start_lon,
            end_lat=req.end_lat,
            end_lon=req.end_lon,
        )
    except nx.NetworkXNoPath:
        raise HTTPException(status_code=404, detail="No walking route found between these points.")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Routing failed: {exc}")
