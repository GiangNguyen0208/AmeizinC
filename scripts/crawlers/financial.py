"""Crawl quarterly financial statements (BCTC) for all tracked symbols."""

from datetime import datetime
from vnstock import Vnstock

from config import TRACKED_SYMBOLS, FINANCE_SOURCE
from utils import write_json, fetch_with_retry, df_row_to_dict


STATEMENT_TYPES = [
    ("income_statement", "incomeStatement", "income"),
    ("balance_sheet", "balanceSheet", "balance"),
    ("cash_flow", "cashFlow", "cashflow"),
]


def _crawl_statement(finance_api, symbol: str, method_name: str, label: str, max_rows: int = 12) -> list[dict]:
    """Fetch a single financial statement type and return as list of dicts."""
    def _fetch(api=finance_api, m=method_name):
        return getattr(api, m)(period="quarter")

    df = fetch_with_retry(_fetch, f"{symbol}/{label}")
    if df is None or len(df) == 0:
        return []

    return [df_row_to_dict(row, df.columns) for _, row in df.head(max_rows).iterrows()]


def crawl_financial_statements():
    print("\n[5/6] Crawling financial statements (BCTC)...")

    for symbol in TRACKED_SYMBOLS:
        stock = Vnstock().stock(symbol=symbol, source=FINANCE_SOURCE)
        finance_data = {
            "symbol": symbol,
            "incomeStatement": [],
            "balanceSheet": [],
            "cashFlow": [],
            "crawledAt": datetime.now().isoformat(),
        }

        for method_name, json_key, label in STATEMENT_TYPES:
            finance_data[json_key] = _crawl_statement(stock.finance, symbol, method_name, label)

        has_data = any(finance_data[key] for _, key, _ in STATEMENT_TYPES)
        if has_data:
            write_json(f"finance-{symbol}.json", finance_data)
            counts = ", ".join(f"{label.upper()}={len(finance_data[key])}" for _, key, label in STATEMENT_TYPES)
            print(f"  {symbol}: {counts}")
        else:
            print(f"  WARN: {symbol}: no financial data")
