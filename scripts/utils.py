"""Shared utilities for all crawlers."""

import json
import time
from datetime import datetime, timedelta

from config import DATA_DIR, MAX_RETRIES, RATE_LIMIT_WAIT, get_request_delay


def write_json(filename: str, data: dict):
    filepath = DATA_DIR / filename
    filepath.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  -> {filename}")


def fetch_with_retry(fn, label: str):
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            result = fn()
            time.sleep(get_request_delay())
            return result
        except Exception as e:
            err_msg = str(e).lower()
            if "rate limit" in err_msg or "429" in err_msg or "giới hạn" in err_msg:
                wait = RATE_LIMIT_WAIT * attempt
                print(f"  ⏳ {label}: rate limited, waiting {wait}s (attempt {attempt}/{MAX_RETRIES})...")
                time.sleep(wait)
            else:
                print(f"  WARN: {label}: {e}")
                return None
    print(f"  ERROR: {label}: max retries exceeded")
    return None


def date_range(days: int) -> tuple[str, str]:
    end = datetime.now()
    start = end - timedelta(days=days)
    return start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")


def to_date_str(val) -> str:
    return str(val)[:10]


def df_row_to_dict(row, columns) -> dict:
    """Convert a pandas DataFrame row to a plain dict, handling numpy scalar types."""
    record = {}
    for col in columns:
        val = row[col]
        if hasattr(val, "item"):
            val = val.item()
        record[col] = val
    return record


def compute_price_change(close_now: float, close_prev: float) -> tuple[float, float]:
    """Return (change, changePercent) between two close prices."""
    change = round(close_now - close_prev, 2)
    change_pct = round((change / close_prev) * 100, 2) if close_prev else 0
    return change, change_pct
