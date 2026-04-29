"""Crawl 365-day historical prices for all tracked symbols."""

from datetime import datetime
from vnstock import Quote

from config import TRACKED_SYMBOLS, SOURCE
from utils import write_json, fetch_with_retry, date_range, to_date_str


def crawl_historical_prices():
    print("\n[4/6] Crawling historical prices (365 days)...")
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
