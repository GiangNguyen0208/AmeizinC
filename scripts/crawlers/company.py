"""Crawl company profile information for all tracked symbols."""

from datetime import datetime
from vnstock import Vnstock

from config import TRACKED_SYMBOLS, FINANCE_SOURCE
from utils import write_json, fetch_with_retry, df_row_to_dict


def crawl_company_info():
    print("\n[6/6] Crawling company info...")
    all_companies = {}

    for symbol in TRACKED_SYMBOLS:
        stock = Vnstock().stock(symbol=symbol, source=FINANCE_SOURCE)

        def _fetch(s=stock):
            return s.company.profile()

        df = fetch_with_retry(_fetch, f"{symbol}/profile")
        if df is None or len(df) == 0:
            continue

        if hasattr(df, "columns"):
            company = df_row_to_dict(df.iloc[0], df.columns)
        else:
            company = dict(df) if isinstance(df, dict) else {"symbol": symbol}

        company["symbol"] = symbol
        all_companies[symbol] = company
        print(f"  {symbol}: OK")

    if all_companies:
        write_json("company-info.json", {
            "data": all_companies,
            "crawledAt": datetime.now().isoformat(),
        })
