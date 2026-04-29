#!/usr/bin/env python3
"""
Ameizin Data Crawler — powered by vnstock.
Fetches Vietnamese stock market data and exports to static JSON files.
Output format is identical to the legacy crawl.ts for frontend compatibility.
"""

import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

from vnstock import Quote

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
MAX_RETRIES = 3
RATE_LIMIT_WAIT = 60

has_api_key = False


def get_request_delay() -> float:
    return 1.2 if has_api_key else 3.5


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


# ─── Market Indices ────────────────────────────────────────────
def crawl_market_indices():
    print("\n[1/4] Crawling market indices...")
    results = []
    start_date, end_date = date_range(7)

    for idx in INDEX_TICKERS:
        ticker, name = idx["ticker"], idx["name"]

        def _fetch(t=ticker, s=start_date, e=end_date):
            q = Quote(symbol=t, source=SOURCE)
            return q.history(start=s, end=e, interval="1D")

        df = fetch_with_retry(_fetch, name)
        if df is None or len(df) < 2:
            continue

        df = df.sort_values("time").reset_index(drop=True)
        latest = df.iloc[-1]
        prev = df.iloc[-2]
        close_now = round(float(latest["close"]), 2)
        close_prev = round(float(prev["close"]), 2)
        change = round(close_now - close_prev, 2)
        change_pct = round((change / close_prev) * 100, 2) if close_prev else 0

        results.append({
            "name": name,
            "value": close_now,
            "change": change,
            "changePercent": change_pct,
            "volume": int(latest["volume"]),
            "updatedAt": to_date_str(latest["time"]),
        })
        sign = "+" if change >= 0 else ""
        print(f"  {name}: {close_now:.2f} ({sign}{change})")

    write_json("market-indices.json", {
        "data": results,
        "crawledAt": datetime.now().isoformat(),
    })


# ─── Stock Prices ──────────────────────────────────────────────
def crawl_stock_prices() -> dict:
    print("\n[2/4] Crawling stock prices...")
    all_prices = {}
    start_date, end_date = date_range(7)

    for symbol in TRACKED_SYMBOLS:
        def _fetch(s=symbol, sd=start_date, ed=end_date):
            q = Quote(symbol=s, source=SOURCE)
            return q.history(start=sd, end=ed, interval="1D")

        df = fetch_with_retry(_fetch, symbol)
        if df is None or len(df) < 2:
            continue

        df = df.sort_values("time").reset_index(drop=True)
        latest = df.iloc[-1]
        prev = df.iloc[-2]
        close_now = float(latest["close"])
        close_prev = float(prev["close"])
        change = round(close_now - close_prev, 2)
        change_pct = round((change / close_prev) * 100, 2) if close_prev else 0

        all_prices[symbol] = {
            "symbol": symbol,
            "price": close_now,
            "change": change,
            "changePercent": change_pct,
            "volume": int(latest["volume"]),
            "high": float(latest["high"]),
            "low": float(latest["low"]),
            "open": float(latest["open"]),
            "previousClose": close_prev,
            "updatedAt": to_date_str(latest["time"]),
        }
        sign = "+" if change >= 0 else ""
        print(f"  {symbol}: {close_now} ({sign}{change})")

    write_json("stock-prices.json", {
        "data": all_prices,
        "crawledAt": datetime.now().isoformat(),
    })

    return all_prices


# ─── Top Movers (derived from stock prices) ────────────────────
def derive_top_movers(all_prices: dict):
    print("\n[3/4] Deriving top movers...")
    stocks = [
        {
            "symbol": s["symbol"],
            "companyName": s["symbol"],
            "price": s["price"],
            "change": s["change"],
            "changePercent": s["changePercent"],
            "volume": s["volume"],
        }
        for s in all_prices.values()
    ]

    gainers = sorted(
        [s for s in stocks if s["changePercent"] > 0],
        key=lambda x: x["changePercent"],
        reverse=True,
    )[:10]

    losers = sorted(
        [s for s in stocks if s["changePercent"] < 0],
        key=lambda x: x["changePercent"],
    )[:10]

    top_vol = sorted(stocks, key=lambda x: x["volume"], reverse=True)[:10]

    now = datetime.now().isoformat()
    write_json("top-gainers.json", {"data": gainers, "crawledAt": now})
    write_json("top-losers.json", {"data": losers, "crawledAt": now})
    write_json("top-volume.json", {"data": top_vol, "crawledAt": now})

    print(f"  Gainers: {len(gainers)}, Losers: {len(losers)}, TopVol: {len(top_vol)}")


# ─── Historical Prices ─────────────────────────────────────────
def crawl_historical_prices():
    print("\n[4/4] Crawling historical prices (365 days)...")
    start_date, end_date = date_range(365)

    for symbol in TRACKED_SYMBOLS:
        def _fetch(s=symbol, sd=start_date, ed=end_date):
            q = Quote(symbol=s, source=SOURCE)
            return q.history(start=sd, end=ed, interval="1D")

        df = fetch_with_retry(_fetch, symbol)
        if df is None or len(df) == 0:
            continue

        df = df.sort_values("time").reset_index(drop=True)
        history = []
        for _, row in df.iterrows():
            history.append({
                "date": to_date_str(row["time"]),
                "open": round(float(row["open"]), 2),
                "high": round(float(row["high"]), 2),
                "low": round(float(row["low"]), 2),
                "close": round(float(row["close"]), 2),
                "volume": int(row["volume"]),
            })

        write_json(f"history-{symbol}.json", {
            "symbol": symbol,
            "data": history,
            "crawledAt": datetime.now().isoformat(),
        })
        print(f"  {symbol}: {len(history)} bars")


# ─── Main ──────────────────────────────────────────────────────
def main():
    print("=== Ameizin Data Crawler (vnstock) ===")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Data dir:  {DATA_DIR}")
    print(f"Source:    {SOURCE}")

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    global has_api_key
    api_key = os.environ.get("VNSTOCK_API_KEY")
    if api_key:
        try:
            from vnstock import register_user
            register_user(api_key=api_key)
            has_api_key = True
            print(f"Registered vnstock API key (60 req/min, delay={get_request_delay()}s)")
        except Exception as e:
            print(f"WARN: Could not register API key: {e}")
    else:
        print(f"No VNSTOCK_API_KEY set — using guest mode (20 req/min, delay={get_request_delay()}s)")

    crawl_market_indices()
    all_prices = crawl_stock_prices()
    derive_top_movers(all_prices)
    crawl_historical_prices()

    write_json("_meta.json", {
        "crawledAt": datetime.now().isoformat(),
        "trackedSymbols": TRACKED_SYMBOLS,
        "source": "vnstock (KBS)",
    })

    print("\n=== Crawl complete ===")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Crawl failed: {e}", file=sys.stderr)
        sys.exit(1)
