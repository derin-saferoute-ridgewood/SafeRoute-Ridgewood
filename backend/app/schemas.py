from typing import Literal

from pydantic import BaseModel, Field


class RouteRequest(BaseModel):
    start_lat: float = Field(..., ge=-90, le=90)
    start_lon: float = Field(..., ge=-180, le=180)

    end_lat: float = Field(..., ge=-90, le=90)
    end_lon: float = Field(..., ge=-180, le=180)

    mode: Literal[
        "fastest",
        "safest",
    ] = "fastest"

    crash_dataset: Literal[
        "low",
        "high",
        "unverified",
    ] = "low"


class SnapRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)