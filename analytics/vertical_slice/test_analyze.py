import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("vertical_analyze", HERE / "analyze.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class VerticalSliceTests(unittest.TestCase):
    def test_seed_is_deterministic_and_complete(self):
        rows = mod.build_seed()
        self.assertEqual(len(rows), 112)
        self.assertEqual(rows[0]["report_id"], "R-01-1-1")
        self.assertEqual(rows[-1]["report_id"], "R-14-4-2")
        self.assertTrue(all(row["source_ref"] == "synthetic-pilot-v1: deterministic fixture" for row in rows))

    def test_analysis_has_traceable_metrics(self):
        with tempfile.TemporaryDirectory() as tmp:
            original = mod.DB_PATH
            mod.DB_PATH = Path(tmp) / "slice.sqlite"
            conn = mod.load_database()
            result = mod.analyze(conn)
            self.assertEqual(result["meta"]["data_status"], "synthetic_pilot")
            self.assertEqual(result["meta"]["record_count"], 112)
            self.assertIn("median_close_hours", result["metrics"])
            self.assertEqual(len(result["trend"]), 14)
            self.assertEqual(result["provenance"]["schema_version"], "reports.v1")
            self.assertTrue(result["alerts"])
            mod.DB_PATH = original

    def test_output_contract_is_json_serializable(self):
        with tempfile.TemporaryDirectory() as tmp:
            original = mod.DB_PATH
            mod.DB_PATH = Path(tmp) / "slice.sqlite"
            conn = mod.load_database()
            result = mod.analyze(conn)
            json.dumps(result, ensure_ascii=False)
            self.assertGreater(result["metrics"]["reports"]["value"], 0)
            self.assertLess(result["metrics"]["median_ack_minutes"]["value"], 60)
            mod.DB_PATH = original


if __name__ == "__main__":
    unittest.main()
