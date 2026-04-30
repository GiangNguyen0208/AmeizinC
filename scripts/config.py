"""Shared configuration constants for all crawlers."""

from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "public" / "data"

TRACKED_SYMBOLS = [
    "VNM", "VIC", "VHM", "HPG", "FPT",
    "MBB", "MSN", "VCB", "TCB", "SSI",
    "VRE", "SAB", "GAS", "PLX", "BVH",
    "ACB", "STB", "TPB", "VPB", "HDB",
]

INDEX_TICKERS = [
    {"ticker": "VNINDEX", "name": "VN-Index"},
    {"ticker": "HNXINDEX", "name": "HNX-Index"},
    {"ticker": "UPCOMINDEX", "name": "UPCOM-Index"},
]

SOURCE = "KBS"
FINANCE_SOURCE = "VCI"
FINANCE_QUARTERS = 20
MAX_RETRIES = 3
RATE_LIMIT_WAIT = 60

has_api_key = False


def get_request_delay() -> float:
    return 1.2 if has_api_key else 3.5
