#!/usr/bin/env python3
"""Deterministic SQLite-backed analytics for the first SENSE vertical slice.

The seed is explicitly synthetic pilot data. It is designed to exercise the
pipeline, not to represent measured municipal performance.
"""
from __future__ import annotations

import csv
import json
import sqlite3
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "runtime" / "sense_vertical_slice.sqlite"
SEED_PATH = ROOT / "seed" / "reports.csv"
OUTPUT_PATH = Path(__file__).resolve().parents[2] / "visualize" / "data" / "dashboard.json"

UTC = timezone.utc
FIELDS = [
    "report_id", "created_at", "area", "category", "priority", "status",
    "acknowledged_at", "assigned_at", "closed_at", "reopened", "rating", "source_ref",
]


def iso(dt: datetime | None) -> str | None:
    return dt.astimezone(UTC).isoformat().replace("+00:00", "Z") if dt else None


def build_seed() -> list[dict[str, object]]:
    """Create a stable, documented synthetic pilot: 4 areas × 14 days × 2 reports."""
    areas = ["البلدة القديمة", "الشارع الرئيسي", "الكنيسة", "المدخل الشرقي"]
    rows: list[dict[str, object]] = []
    start = datetime(2026, 9, 1, 8, tzinfo=UTC)
    for day in range(14):
        for area_index, area in enumerate(areas):
            for slot in range(2):
                created = start + timedelta(days=day, hours=area_index + slot * 3)
                # A deterministic operational pattern: the main street gets slower
                # after day 7, while the old town has the strongest accessibility signal.
                category = "الوصول والتنقل" if (day + area_index + slot) % 3 else "المعلومة والهوية"
                priority = "عالٍ" if (area_index == 1 and day >= 7) else ("متوسط" if slot else "منخفض")
                ack_minutes = 18 + area_index * 7 + (12 if day >= 7 and area_index == 1 else 0) + slot * 5
                assign_minutes = 35 + area_index * 10 + (18 if day >= 7 and area_index == 1 else 0)
                close_hours = 10 + area_index * 5 + (14 if day >= 7 and area_index == 1 else 0) + slot * 3
                acknowledged = created + timedelta(minutes=ack_minutes)
                assigned = created + timedelta(minutes=assign_minutes)
                closed = created + timedelta(hours=close_hours)
                reopened = 1 if (day + area_index + slot) % 11 == 0 else 0
                rating = None if (day + area_index + slot) % 5 == 0 else 3 + ((day + slot) % 3)
                rows.append({
                    "report_id": f"R-{day + 1:02d}-{area_index + 1}-{slot + 1}",
                    "created_at": iso(created), "area": area, "category": category,
                    "priority": priority, "status": "مغلق", "acknowledged_at": iso(acknowledged),
                    "assigned_at": iso(assigned), "closed_at": iso(closed), "reopened": reopened,
                    "rating": rating, "source_ref": "synthetic-pilot-v1: deterministic fixture",
                })
    return rows


def ensure_seed() -> None:
    if SEED_PATH.exists():
        return
    SEED_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SEED_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(build_seed())


def load_database() -> sqlite3.Connection:
    ROOT.joinpath("runtime").mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript("""
        DROP TABLE IF EXISTS reports;
        CREATE TABLE reports (
            report_id TEXT PRIMARY KEY, created_at TEXT NOT NULL, area TEXT NOT NULL,
            category TEXT NOT NULL, priority TEXT NOT NULL, status TEXT NOT NULL,
            acknowledged_at TEXT NOT NULL, assigned_at TEXT NOT NULL, closed_at TEXT NOT NULL,
            reopened INTEGER NOT NULL, rating REAL, source_ref TEXT NOT NULL
        );
        CREATE INDEX idx_reports_created ON reports(created_at);
        CREATE INDEX idx_reports_area ON reports(area);
        CREATE INDEX idx_reports_category ON reports(category);
    """)
    with SEED_PATH.open(encoding="utf-8", newline="") as f:
        conn.executemany(
            "INSERT INTO reports VALUES (:report_id,:created_at,:area,:category,:priority,:status,:acknowledged_at,:assigned_at,:closed_at,:reopened,:rating,:source_ref)",
            list(csv.DictReader(f)),
        )
    conn.commit()
    return conn


def minutes_between(a: str, b: str) -> float:
    return (datetime.fromisoformat(b.replace("Z", "+00:00")) - datetime.fromisoformat(a.replace("Z", "+00:00"))).total_seconds() / 60


def percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    values = sorted(values)
    index = (len(values) - 1) * p
    lower, upper = int(index), min(int(index) + 1, len(values) - 1)
    return values[lower] + (values[upper] - values[lower]) * (index - lower)


def analyze(conn: sqlite3.Connection) -> dict[str, object]:
    rows = [dict(r) for r in conn.execute("SELECT * FROM reports ORDER BY created_at")]
    ack = [minutes_between(r["created_at"], r["acknowledged_at"]) for r in rows]
    assign = [minutes_between(r["created_at"], r["assigned_at"]) for r in rows]
    close = [minutes_between(r["created_at"], r["closed_at"]) / 60 for r in rows]
    ratings = [float(r["rating"]) for r in rows if r["rating"] not in (None, "")]
    by_area: dict[str, list[float]] = defaultdict(list)
    daily: dict[str, list[float]] = defaultdict(list)
    for r, close_hours in zip(rows, close):
        by_area[r["area"]].append(close_hours)
        daily[r["created_at"][:10]].append(close_hours)

    area_stats = [{"area": area, "reports": len(values), "median_close_hours": round(percentile(values, .5), 2), "reopen_rate": round(sum(r["reopened"] for r in rows if r["area"] == area) / len(values) * 100, 1)} for area, values in by_area.items()]
    daily_trend = [{"date": day, "reports": len(values), "median_close_hours": round(percentile(values, .5), 2)} for day, values in sorted(daily.items())]
    category_counts = Counter(r["category"] for r in rows)
    workflow = [{"stage": "استقبال", "value": len(rows)}, {"stage": "إقرار الاستلام", "value": len(rows)}, {"stage": "إحالة", "value": len(rows)}, {"stage": "إغلاق", "value": sum(r["status"] == "مغلق" for r in rows)}, {"stage": "تقييم", "value": len(ratings)}]
    slow_area = max(area_stats, key=lambda x: x["median_close_hours"])
    alerts = []
    if slow_area["median_close_hours"] > 24:
        alerts.append({"severity": "warning", "title": "منطقة تتجاوز عتبة الإغلاق", "detail": f"الوسيط في {slow_area['area']} هو {slow_area['median_close_hours']} ساعة، فوق عتبة 24 ساعة.", "evidence": "computed from reports.closed_at - reports.created_at"})
    alerts.append({"severity": "info", "title": "نطاق البيانات محدود", "detail": "هذه شريحة تجريبية اصطناعية من 112 بلاغًا، وليست قياسًا بلديًا.", "evidence": "seed/reports.csv; synthetic-pilot-v1"})

    source = "analytics/vertical_slice/seed/reports.csv"
    return {
        "meta": {"project": "SENSE / TIBYAN", "destination": "Al-Eizariya", "version": "0.2.0-vertical-slice", "data_status": "synthetic_pilot", "status_label": "تحليل قابل لإعادة التشغيل · بيانات اصطناعية موثقة", "last_updated": rows[-1]["created_at"], "source": source, "method": "SQLite + deterministic Python aggregation", "record_count": len(rows), "privacy": "لا توجد بيانات شخصية؛ المعرّفات اصطناعية"},
        "period": {"label": "1–14 أيلول 2026 · شريحة تجريبية", "start": rows[0]["created_at"][:10], "end": rows[-1]["created_at"][:10]},
        "filters": {"areas": sorted(by_area), "categories": sorted(category_counts)},
        "metrics": {
            "reports": {"label": "إجمالي البلاغات", "value": len(rows), "unit": "بلاغ", "target": None, "confidence": "عينة اصطناعية مكتملة"},
            "median_ack_minutes": {"label": "الوسيط حتى إقرار الاستلام", "value": round(percentile(ack, .5), 1), "unit": "دقيقة", "target": 30, "direction": "down", "confidence": "محسوب من طوابع زمنية"},
            "median_assign_minutes": {"label": "الوسيط حتى الإحالة", "value": round(percentile(assign, .5), 1), "unit": "دقيقة", "target": 60, "direction": "down", "confidence": "محسوب من طوابع زمنية"},
            "median_close_hours": {"label": "الوسيط حتى الإغلاق", "value": round(percentile(close, .5), 1), "unit": "ساعة", "target": 24, "direction": "down", "confidence": "محسوب من طوابع زمنية"},
            "reopen_rate": {"label": "معدل إعادة الفتح", "value": round(sum(r["reopened"] for r in rows) / len(rows) * 100, 1), "unit": "%", "target": 5, "direction": "down", "confidence": "محسوب من حقل reopened"},
            "average_rating": {"label": "متوسط التقييم", "value": round(sum(ratings) / len(ratings), 2), "unit": "/5", "target": 4, "direction": "up", "confidence": "من 90 تقييمًا متاحًا"},
        },
        "funnel": workflow,
        "reports": {"workflow": workflow, "by_category": [{"category": k, "value": v, "color": "#d97850"} for k, v in category_counts.items()]},
        "trend": daily_trend,
        "area_analysis": area_stats,
        "alerts": alerts,
        "provenance": {"source_type": "synthetic_fixture", "source_path": source, "schema_version": "reports.v1", "generated_by": "analytics/vertical_slice/analyze.py", "calculation_notes": ["الوسيط محسوب بالاستيفاء الخطي على مدد البلاغات.", "معدل إعادة الفتح = البلاغات المعاد فتحها ÷ إجمالي البلاغات.", "البيانات اصطناعية لا تمثل سكانًا أو بلاغات حقيقية."]},
        "assumptions": ["هذه ليست قياسات ميدانية أو بلدية.", "تم تثبيت مصدر واحد ونطاق واحد لبناء Vertical Slice قابل للاختبار.", "لا تُعرض أي معلومات شخصية.", "يجب استبدال seed/reports.csv بتصدير معتمد قبل أي قرار تشغيلي."],
    }


def main() -> None:
    ensure_seed()
    conn = load_database()
    payload = analyze(conn)
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"generated {OUTPUT_PATH} from {payload['meta']['record_count']} records")


if __name__ == "__main__":
    main()
