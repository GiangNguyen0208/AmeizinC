"""Crawl quarterly financial statements (BCTC) for all tracked symbols."""

from datetime import datetime
import re
from vnstock import Finance

from config import TRACKED_SYMBOLS, FINANCE_SOURCE, FINANCE_QUARTERS
from utils import write_json, fetch_with_retry, df_row_to_dict


STATEMENT_TYPES = [
    ("income_statement", "incomeStatement", "income"),
    ("balance_sheet", "balanceSheet", "balance"),
    ("cash_flow", "cashFlow", "cashflow"),
]


def _has_quarter_columns(columns) -> bool:
    return any(re.match(r"^\d{4}-Q\d$", str(col)) for col in columns)


def _crawl_statement(
    finance: Finance,
    symbol: str,
    method_name: str,
    label: str,
    max_quarters: int = FINANCE_QUARTERS,
) -> list[dict]:
    """Fetch a single financial statement type and return as list of dicts."""
    def _fetch():
        return getattr(finance, method_name)(period="quarter")

    df = fetch_with_retry(_fetch, f"{symbol}/{label}")
    if df is None or len(df) == 0:
        return []

    # VCI-style data is item rows + quarter columns; keep all item rows so
    # revenue/profit/equity rows are not accidentally dropped.
    if not _has_quarter_columns(df.columns):
        df = df.head(max_quarters)

    return [df_row_to_dict(row, df.columns) for _, row in df.iterrows()]


def crawl_financial_statements():
    print("\n[5/6] Crawling financial statements (BCTC)...")

    for symbol in TRACKED_SYMBOLS:
        finance = Finance(symbol=symbol, source=FINANCE_SOURCE, show_log=False)
        finance_data = {
            "symbol": symbol,
            "incomeStatement": [],
            "balanceSheet": [],
            "cashFlow": [],
            "crawledAt": datetime.now().isoformat(),
        }

        for method_name, json_key, label in STATEMENT_TYPES:
            finance_data[json_key] = _crawl_statement(finance, symbol, method_name, label)

        has_data = any(finance_data[key] for _, key, _ in STATEMENT_TYPES)
        if has_data:
            write_json(f"finance-{symbol}.json", finance_data)
            counts = ", ".join(f"{label.upper()}={len(finance_data[key])}" for _, key, label in STATEMENT_TYPES)
            print(f"  {symbol}: {counts}")
        else:
            print(f"  WARN: {symbol}: no financial data")
