"""Crawl Vietnamese market indices (VN-Index, HNX-Index, UPCOM-Index)."""

from datetime import datetime
from vnstock import Quote

from config import INDEX_TICKERS, SOURCE
from utils import write_json, fetch_with_retry, date_range, to_date_str, compute_price_change


def crawl_market_indices():
    print("\n[1/6] Crawling market indices...")
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
        change, change_pct = compute_price_change(close_now, close_prev)

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
