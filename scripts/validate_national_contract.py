#!/usr/bin/env python3
"""Validate the SENSE National destination contract without network access."""
import json
import sys
from datetime import date
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "public-index/national/destinations.json"
REQUIRED = {"id", "name", "cluster", "status", "statusLabel", "type", "region", "summary", "facts", "ownerStatus"}

def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)

try:
    data = json.loads(PATH.read_text(encoding="utf-8"))
except Exception as exc:
    fail(f"cannot parse {PATH}: {exc}")

if data.get("schemaVersion") != "1.0.0":
    fail("schemaVersion must be 1.0.0")
if not data.get("datasetId"):
    fail("datasetId is required")
if not isinstance(data.get("statusVocabulary"), list) or not data["statusVocabulary"]:
    fail("statusVocabulary must be a non-empty list")
if not isinstance(data.get("destinations"), list) or not data["destinations"]:
    fail("destinations must be a non-empty list")

ids = set()
for index, item in enumerate(data["destinations"], start=1):
    prefix = f"destinations[{index}]"
    if not isinstance(item, dict):
        fail(f"{prefix} must be an object")
    missing = REQUIRED - item.keys()
    if missing:
        fail(f"{prefix} missing fields: {', '.join(sorted(missing))}")
    if item["id"] in ids:
        fail(f"duplicate destination id: {item['id']}")
    ids.add(item["id"])
    if item["status"] not in data["statusVocabulary"]:
        fail(f"{item['id']} uses unknown status: {item['status']}")
    for field in ("id", "name", "cluster", "statusLabel", "type", "region", "summary", "ownerStatus"):
        if not isinstance(item[field], str) or not item[field].strip():
            fail(f"{item['id']} field {field} must be a non-empty string")
    if not isinstance(item["facts"], list) or not item["facts"]:
        fail(f"{item['id']} facts must be a non-empty list")
    if item.get("href") is not None and not isinstance(item["href"], str):
        fail(f"{item['id']} href must be a string or null")

try:
    reviewed = date.fromisoformat(data["lastReviewed"])
except (KeyError, ValueError):
    fail("lastReviewed must use YYYY-MM-DD")
if reviewed > date.today():
    fail("lastReviewed cannot be in the future")

print(f"OK: validated {len(data['destinations'])} destinations in {data['datasetId']}")
