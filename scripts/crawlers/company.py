"""Crawl company profile information for all tracked symbols."""

from datetime import datetime
from vnstock import Company

from config import TRACKED_SYMBOLS, FINANCE_SOURCE
from utils import write_json, fetch_with_retry, df_row_to_dict


def crawl_company_info():
    print("\n[6/6] Crawling company info...")
    all_companies = {}

    for symbol in TRACKED_SYMBOLS:
        company = Company(symbol=symbol, source=FINANCE_SOURCE, show_log=False)

        def _fetch(c=company):
            return c.overview()

        df = fetch_with_retry(_fetch, f"{symbol}/profile")
        if df is None or len(df) == 0:
            continue

        if hasattr(df, "columns"):
            profile = df_row_to_dict(df.iloc[0], df.columns)
        else:
            profile = dict(df) if isinstance(df, dict) else {"symbol": symbol}

        profile["symbol"] = symbol
        all_companies[symbol] = profile
        print(f"  {symbol}: OK")

    if all_companies:
        write_json("company-info.json", {
            "data": all_companies,
            "crawledAt": datetime.now().isoformat(),
        })
