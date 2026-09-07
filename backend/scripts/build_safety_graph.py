from pathlib import Path
import re

import numpy as np
import osmnx as ox
import pandas as pd


BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

DATA_DIR = (
    BASE_DIR
    / "data"
)

BASE_GRAPH_PATH = (
    DATA_DIR
    / "ridgewood_walk.graphml"
)

CRASH_PATH = (
    DATA_DIR
    / (
        "SafeRoute_Ridgewood_"
        "Pedestrian_Crashes_"
        "Normalized.csv"
    )
)

OUTPUT_PATH = (
    DATA_DIR
    / "ridgewood_safety_weighted.graphml"
)


# ==================================================
# MODEL SETTINGS
# ==================================================

SAFETY_MULTIPLIER = 1.5


FACTOR_WEIGHTS = {
    "crash":
        0.50,

    "speed":
        0.20,

    "sidewalk":
        0.20,

    "crossing":
        0.10,
}


# ==================================================
# COLUMN HELPERS
# ==================================================

def normalized_column_name(
    value,
):

    return (
        re.sub(
            r"[^a-z0-9]",
            "",
            str(value)
            .lower()
            .strip(),
        )
    )


def find_column(
    dataframe,
    candidates,
    required=False,
):

    lookup = {
        normalized_column_name(
            column
        ):
        column

        for column
        in dataframe.columns
    }

    for candidate in candidates:

        key = normalized_column_name(
            candidate
        )

        if key in lookup:

            return lookup[key]

    if required:

        raise ValueError(
            "Could not find required "
            "CSV column. Tried: "
            f"{candidates}"
        )

    return None


# ==================================================
# GENERAL HELPERS
# ==================================================

def as_text(
    value,
):

    if value is None:
        return ""

    if isinstance(
        value,
        (
            list,
            tuple,
            set,
        ),
    ):

        return ";".join(
            str(item)
            for item
            in value
        )

    return str(
        value
    ).strip()


def parse_speed_mph(
    value,
):

    text = (
        as_text(value)
        .lower()
    )

    if not text:

        return None

    numbers = re.findall(
        r"\d+(?:\.\d+)?",
        text,
    )

    if not numbers:

        return None

    speed = float(
        numbers[0]
    )

    if (
        "km/h" in text
        or "kph" in text
        or "kmh" in text
    ):

        speed *= 0.621371

    return speed


def speed_to_score(
    speed_mph,
):

    if speed_mph is None:

        return None

    if speed_mph <= 20:
        return 0.0

    if speed_mph <= 25:
        return 0.2

    if speed_mph <= 30:
        return 0.4

    if speed_mph <= 35:
        return 0.6

    if speed_mph <= 40:
        return 0.8

    return 1.0


# ==================================================
# SIDEWALK
# ==================================================

def sidewalk_value(
    data,
):

    sidewalk = (
        as_text(
            data.get(
                "sidewalk"
            )
        )
        .lower()
    )

    left = (
        as_text(
            data.get(
                "sidewalk:left"
            )
        )
        .lower()
    )

    right = (
        as_text(
            data.get(
                "sidewalk:right"
            )
        )
        .lower()
    )

    both = (
        as_text(
            data.get(
                "sidewalk:both"
            )
        )
        .lower()
    )

    yes_values = {
        "yes",
        "both",
        "separate",
        "raised",
    }

    no_values = {
        "no",
        "none",
    }

    if (
        both in yes_values
        or sidewalk
        == "both"
    ):

        return (
            0.0,
            1,
        )

    if sidewalk in {
        "yes",
        "separate",
    }:

        return (
            0.2,
            1,
        )

    left_yes = (
        left
        in yes_values
    )

    right_yes = (
        right
        in yes_values
    )

    left_no = (
        left
        in no_values
    )

    right_no = (
        right
        in no_values
    )

    if (
        left_yes
        and right_yes
    ):

        return (
            0.0,
            1,
        )

    if (
        left_yes
        or right_yes
    ):

        return (
            0.3,
            1,
        )

    if (
        sidewalk
        in no_values
        or (
            left_no
            and right_no
        )
    ):

        return (
            1.0,
            1,
        )

    return (
        0.0,
        0,
    )


# ==================================================
# CROSSING
# ==================================================

def node_crossing_value(
    node_data,
):

    highway = (
        as_text(
            node_data.get(
                "highway"
            )
        )
        .lower()
    )

    crossing = (
        as_text(
            node_data.get(
                "crossing"
            )
        )
        .lower()
    )

    signals = (
        as_text(
            node_data.get(
                "crossing:signals"
            )
        )
        .lower()
    )

    if (
        highway
        == "traffic_signals"
        or signals
        == "yes"
    ):

        return (
            0.0,
            1,
        )

    if highway == "crossing":

        if crossing in {
            "traffic_signals",
            "signals",
            "controlled",
        }:

            return (
                0.0,
                1,
            )

        if crossing in {
            "marked",
            "zebra",
            "uncontrolled",
        }:

            return (
                0.25,
                1,
            )

        return (
            0.4,
            1,
        )

    return (
        0.0,
        0,
    )


def edge_crossing_value(
    G,
    u,
    v,
):

    scores = []

    for node in (
        u,
        v,
    ):

        score, known = (
            node_crossing_value(
                G.nodes[node]
            )
        )

        if known:
            scores.append(
                score
            )

    if not scores:

        return (
            0.0,
            0,
        )

    return (
        max(scores),
        1,
    )


# ==================================================
# LIGHTING
# ==================================================

def lighting_value(
    data,
):

    lit = (
        as_text(
            data.get(
                "lit"
            )
        )
        .lower()
    )

    if lit in {
        "yes",
        "24/7",
        "automatic",
    }:

        return (
            0.0,
            1,
        )

    if lit == "no":

        return (
            1.0,
            1,
        )

    return (
        0.0,
        0,
    )


# ==================================================
# REVERSE EDGE MATCHING
# ==================================================

def reverse_edge_key(
    G,
    u,
    v,
    matched_data,
):

    if not G.has_edge(
        v,
        u,
    ):

        return None

    reverse_edges = (
        G.get_edge_data(
            v,
            u,
        )
    )

    if not reverse_edges:

        return None

    matched_length = float(
        matched_data.get(
            "length",
            0.0,
        )
    )

    return min(
        reverse_edges.keys(),

        key=lambda key:
            abs(
                float(
                    reverse_edges[
                        key
                    ].get(
                        "length",
                        matched_length,
                    )
                )
                - matched_length
            ),
    )


# ==================================================
# NORMALIZATION
# ==================================================

def log_normalize(
    value,
    maximum,
):

    if maximum <= 0:

        return 0.0

    return float(
        np.log1p(value)
        / np.log1p(maximum)
    )


# ==================================================
# COMBINED MODEL
# ==================================================

def calculate_pedestrian_risk(
    data,
):

    components = [
        (
            float(
                data[
                    "crash_severity_score"
                ]
            ),
            FACTOR_WEIGHTS[
                "crash"
            ],
            True,
        ),

        (
            float(
                data[
                    "speed_score"
                ]
            ),
            FACTOR_WEIGHTS[
                "speed"
            ],
            bool(
                int(
                    data[
                        "speed_known"
                    ]
                )
            ),
        ),

        (
            float(
                data[
                    "sidewalk_score"
                ]
            ),
            FACTOR_WEIGHTS[
                "sidewalk"
            ],
            bool(
                int(
                    data[
                        "sidewalk_known"
                    ]
                )
            ),
        ),

        (
            float(
                data[
                    "crossing_score"
                ]
            ),
            FACTOR_WEIGHTS[
                "crossing"
            ],
            bool(
                int(
                    data[
                        "crossing_known"
                    ]
                )
            ),
        ),
    ]

    weighted_sum = 0.0
    available_weight = 0.0

    for (
        score,
        weight,
        known,
    ) in components:

        if not known:
            continue

        weighted_sum += (
            score
            * weight
        )

        available_weight += (
            weight
        )

    if available_weight <= 0:

        return (
            0.0,
            0.0,
        )

    risk = (
        weighted_sum
        / available_weight
    )

    total_weight = sum(
        FACTOR_WEIGHTS.values()
    )

    coverage = (
        available_weight
        / total_weight
    )

    return (
        float(risk),
        float(coverage),
    )


# ==================================================
# LOAD GRAPH
# ==================================================

print(
    "Loading base Ridgewood "
    "walking graph..."
)

G = ox.load_graphml(
    BASE_GRAPH_PATH
)


# ==================================================
# LOAD CRASH DATA
# ==================================================

print(
    "Loading pedestrian crash data..."
)

crashes = pd.read_csv(
    CRASH_PATH
)


latitude_col = find_column(
    crashes,
    [
        "latitude",
        "lat",
    ],
    required=True,
)

longitude_col = find_column(
    crashes,
    [
        "longitude",
        "lon",
        "lng",
    ],
    required=True,
)

injury_col = find_column(
    crashes,
    [
        "pedestrianinjurycount",
        "pedestrian injury count",
        "pedestrian_injury_count",
    ],
    required=True,
)

fatality_col = find_column(
    crashes,
    [
        "pedestrianfatalitycount",
        "pedestrian fatality count",
        "pedestrian_fatality_count",
    ],
    required=True,
)


for column in [
    latitude_col,
    longitude_col,
    injury_col,
    fatality_col,
]:

    crashes[column] = (
        pd.to_numeric(
            crashes[column],
            errors="coerce",
        )
    )


crashes = crashes.dropna(
    subset=[
        latitude_col,
        longitude_col,
    ]
).copy()


print(
    "Crash records with "
    "usable coordinates:",
    len(crashes),
)


if len(crashes) == 0:

    raise ValueError(
        "No crash records have "
        "usable latitude/longitude."
    )


# ==================================================
# INITIALIZE CRASH ATTRIBUTES
# ==================================================

for _, _, _, data in G.edges(
    keys=True,
    data=True,
):

    data[
        "crash_count"
    ] = 0

    data[
        "crash_severity_total"
    ] = 0.0


# ==================================================
# MAP CRASHES TO EDGES
# ==================================================

nearest_edges = (
    ox.distance.nearest_edges(
        G,

        X=crashes[
            longitude_col
        ].to_numpy(),

        Y=crashes[
            latitude_col
        ].to_numpy(),
    )
)


for (
    edge,
    (_, crash),
) in zip(
    nearest_edges,
    crashes.iterrows(),
):

    u, v, key = edge

    edge_data = (
        G[u][v][key]
    )

    injuries = (
        crash.get(
            injury_col,
            0.0,
        )
    )

    fatalities = (
        crash.get(
            fatality_col,
            0.0,
        )
    )

    injuries = (
        0.0
        if pd.isna(injuries)
        else float(injuries)
    )

    fatalities = (
        0.0
        if pd.isna(fatalities)
        else float(fatalities)
    )

    # Prototype engineering severity scale.
    severity_value = (
        1.0
        + 1.5
        * injuries
        + 5.0
        * fatalities
    )

    edge_data[
        "crash_count"
    ] += 1

    edge_data[
        "crash_severity_total"
    ] += severity_value

    reverse_key = (
        reverse_edge_key(
            G,
            u,
            v,
            edge_data,
        )
    )

    if reverse_key is not None:

        reverse_data = (
            G[v][u][
                reverse_key
            ]
        )

        reverse_data[
            "crash_count"
        ] += 1

        reverse_data[
            "crash_severity_total"
        ] += severity_value


# ==================================================
# NORMALIZE CRASH SEVERITY
# ==================================================

max_crash_severity = max(
    (
        float(
            data.get(
                "crash_severity_total",
                0.0,
            )
        )

        for _, _, _, data
        in G.edges(
            keys=True,
            data=True,
        )
    ),
    default=0.0,
)


for _, _, _, data in G.edges(
    keys=True,
    data=True,
):

    value = float(
        data.get(
            "crash_severity_total",
            0.0,
        )
    )

    data[
        "crash_severity_score"
    ] = log_normalize(
        value,
        max_crash_severity,
    )


# ==================================================
# ROAD ATTRIBUTES
# ==================================================

for u, v, _, data in G.edges(
    keys=True,
    data=True,
):

    speed_mph = (
        parse_speed_mph(
            data.get(
                "maxspeed"
            )
        )
    )

    speed_score = (
        speed_to_score(
            speed_mph
        )
    )

    if speed_score is None:

        data[
            "speed_mph"
        ] = 0.0

        data[
            "speed_score"
        ] = 0.0

        data[
            "speed_known"
        ] = 0

    else:

        data[
            "speed_mph"
        ] = float(
            speed_mph
        )

        data[
            "speed_score"
        ] = float(
            speed_score
        )

        data[
            "speed_known"
        ] = 1


    (
        sidewalk_score,
        sidewalk_known,
    ) = sidewalk_value(
        data
    )

    data[
        "sidewalk_score"
    ] = float(
        sidewalk_score
    )

    data[
        "sidewalk_known"
    ] = int(
        sidewalk_known
    )


    (
        crossing_score,
        crossing_known,
    ) = edge_crossing_value(
        G,
        u,
        v,
    )

    data[
        "crossing_score"
    ] = float(
        crossing_score
    )

    data[
        "crossing_known"
    ] = int(
        crossing_known
    )


    (
        lighting_score,
        lighting_known,
    ) = lighting_value(
        data
    )

    data[
        "lighting_score"
    ] = float(
        lighting_score
    )

    data[
        "lighting_known"
    ] = int(
        lighting_known
    )


# ==================================================
# FINAL PEDESTRIAN RISK
# ==================================================

for _, _, _, data in G.edges(
    keys=True,
    data=True,
):

    (
        risk,
        coverage,
    ) = (
        calculate_pedestrian_risk(
            data
        )
    )

    risk = min(
        1.0,
        max(
            0.0,
            risk,
        ),
    )

    coverage = min(
        1.0,
        max(
            0.0,
            coverage,
        ),
    )

    safety_score = (
        100.0
        * (
            1.0
            - risk
        )
    )

    length = float(
        data.get(
            "length",
            1.0,
        )
    )

    safety_weight = (
        length
        * (
            1.0
            + SAFETY_MULTIPLIER
            * risk
        )
    )

    data[
        "pedestrian_risk"
    ] = float(
        risk
    )

    data[
        "pedestrian_safety_score"
    ] = float(
        safety_score
    )

    data[
        "safety_data_coverage"
    ] = float(
        coverage
    )

    data[
        "safety_weight"
    ] = float(
        safety_weight
    )


# ==================================================
# DATA COVERAGE REPORT
# ==================================================

edge_count = (
    G.number_of_edges()
)


def known_percentage(
    field,
):

    if edge_count == 0:
        return 0.0

    known = sum(
        int(
            float(
                data.get(
                    field,
                    0,
                )
            )
        )

        for _, _, _, data
        in G.edges(
            keys=True,
            data=True,
        )
    )

    return (
        100.0
        * known
        / edge_count
    )


print()
print(
    "SAFEROUTE PHASE 3 DATA COVERAGE"
)
print(
    "=" * 50
)

print(
    "Edges:",
    edge_count,
)

print(
    "Speed known:",
    f"{known_percentage('speed_known'):.1f}%",
)

print(
    "Sidewalk known:",
    f"{known_percentage('sidewalk_known'):.1f}%",
)

print(
    "Crossing known:",
    f"{known_percentage('crossing_known'):.1f}%",
)

print(
    "Lighting known:",
    f"{known_percentage('lighting_known'):.1f}%",
)

print(
    "Maximum crash severity:",
    round(
        max_crash_severity,
        2,
    ),
)

print(
    "Safety multiplier:",
    SAFETY_MULTIPLIER,
)


# ==================================================
# SAVE
# ==================================================

ox.save_graphml(
    G,
    OUTPUT_PATH,
)


print()
print(
    "SUCCESS"
)

print(
    "Saved:"
)

print(
    OUTPUT_PATH
)