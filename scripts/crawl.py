#!/usr/bin/env python3
"""
Ameizin Data Crawler — powered by vnstock.
Fetches Vietnamese stock market data and exports to static JSON files.

Entry point that orchestrates all crawler modules.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import config
from utils import write_json
from crawlers import (
    crawl_market_indices,
    crawl_stock_prices,
    derive_top_movers,
    crawl_historical_prices,
    crawl_financial_statements,
    crawl_company_info,
)


def main():
    print("=== Ameizin Data Crawler (vnstock) ===")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Data dir:  {config.DATA_DIR}")
    print(f"Source:    {config.SOURCE}")

    config.DATA_DIR.mkdir(parents=True, exist_ok=True)

    api_key = os.environ.get("VNSTOCK_API_KEY")
    if api_key:
        try:
            from vnstock import register_user
            register_user(api_key=api_key)
            config.has_api_key = True
            print(f"Registered vnstock API key (60 req/min, delay={config.get_request_delay()}s)")
        except Exception as e:
            print(f"WARN: Could not register API key: {e}")
    else:
        print(f"No VNSTOCK_API_KEY set — using guest mode (20 req/min, delay={config.get_request_delay()}s)")

    crawl_market_indices()
    all_prices = crawl_stock_prices()
    derive_top_movers(all_prices)
    crawl_historical_prices()
    crawl_financial_statements()
    crawl_company_info()

    write_json("_meta.json", {
        "crawledAt": datetime.now().isoformat(),
        "trackedSymbols": config.TRACKED_SYMBOLS,
        "source": "vnstock (KBS)",
    })

    print("\n=== Crawl complete ===")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Crawl failed: {e}", file=sys.stderr)
        sys.exit(1)
