import re


SUFFIXES = {
    "ave": "avenue",
    "av": "avenue",
    "st": "street",
    "rd": "road",
    "dr": "drive",
    "pl": "place",
    "ct": "court",
    "ter": "terrace",
    "cir": "circle",
    "pkwy": "parkway",
    "pky": "parkway",
    "ln": "lane",
    "blvd": "boulevard",
    "hwy": "highway",
    "trl": "trail",
}

DIRECTIONS = {
    "n": "north",
    "s": "south",
    "e": "east",
    "w": "west",
}


def _key(value):
    return re.sub(r"\s+", " ", str(value or "").strip()).casefold()


def _canonical_name(value):
    text = _key(value)
    text = re.sub(r"^\d+[a-z]?\s+", "", text)
    text = re.sub(r"\[[^\]]*\]", " ", text)
    text = re.sub(r"\([^)]*(?:bergen county|parking lot)[^)]*\)", " ", text)
    text = text.split(";", 1)[0]
    text = re.sub(r"[^a-z0-9]+", " ", text).strip()
    tokens = text.split()

    if tokens and tokens[0] in DIRECTIONS:
        tokens[0] = DIRECTIONS[tokens[0]]
    if tokens and tokens[-1] in SUFFIXES:
        tokens[-1] = SUFFIXES[tokens[-1]]
    if tokens and tokens[0] == "rt":
        tokens[0] = "route"

    return " ".join(tokens)


def load_normalized_street_aliases(path):
    import csv

    aliases = {}
    crash_ids = {}

    with path.open(newline="", encoding="utf-8-sig") as csv_file:
        for row in csv.DictReader(csv_file):
            normalized = row.get("normalized_street", "").strip()
            if not normalized:
                continue

            for field in ("streetname_original_njdot", "streetname"):
                original = row.get(field, "").strip()
                if original:
                    aliases[_key(original)] = normalized

            crash_id = row.get("Crash ID", "").strip()
            if crash_id:
                crash_ids[crash_id] = normalized

    return aliases, crash_ids


def street_name_candidates(value, aliases=None):
    aliases = aliases or {}
    text = str(value or "").strip()
    alias = aliases.get(_key(text))
    if alias:
        return [_canonical_name(alias)]

    candidates = [_canonical_name(text)]
    parenthetical_names = re.findall(r"\(([^()]*)\)", text)
    for name in parenthetical_names:
        if re.search(
            r"\b(?:avenue|ave|road|rd|street|st|drive|dr|place|pl|"
            r"court|ct|terrace|ter|circle|cir|parkway|pkwy|lane|ln)\b",
            name,
            re.IGNORECASE,
        ):
            candidates.append(_canonical_name(name))

    return list(dict.fromkeys(candidate for candidate in candidates if candidate))
