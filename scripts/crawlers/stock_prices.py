"""Crawl individual stock prices and derive top movers."""

from datetime import datetime
from vnstock import Quote

from config import TRACKED_SYMBOLS, SOURCE
from utils import write_json, fetch_with_retry, date_range, to_date_str, compute_price_change


def crawl_stock_prices() -> dict:
    print("\n[2/6] Crawling stock prices...")
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
        change, change_pct = compute_price_change(close_now, close_prev)

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


def derive_top_movers(all_prices: dict):
    print("\n[3/6] Deriving top movers...")
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
