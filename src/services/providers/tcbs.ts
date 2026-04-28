import { tcbsApi } from "../api-client";
import type { StockPrice, HistoricalPrice, TopStock } from "@/types";

interface TcbsBar {
  tradingDate: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ticker?: string;
}

interface TcbsOverview {
  ticker: string;
  shortName: string;
  exchange: string;
  industry: string;
  companyType: string;
  noShareholders: number;
  foreignPercent: number;
  outstandingShare: number;
  issueShare: number;
  marketCap: number;
}

export async function tcbsFetchHistoricalPrices(
  symbol: string,
  days: number = 90
): Promise<HistoricalPrice[]> {
  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 60 * 60;

  const { data } = await tcbsApi.get(
    `/stock-insight/v1/stock/bars-long-term`,
    {
      params: {
        ticker: symbol.toUpperCase(),
        type: "stock",
        resolution: "D",
        from,
        to,
      },
    }
  );

  const bars: TcbsBar[] = data.data || [];
  return bars.map((bar) => ({
    date: bar.tradingDate.split("T")[0],
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: bar.volume,
  }));
}

export async function tcbsFetchStockPrice(
  symbol: string
): Promise<StockPrice> {
  const history = await tcbsFetchHistoricalPrices(symbol, 5);

  if (history.length < 2) {
    throw new Error(`No data for ${symbol}`);
  }

  const latest = history[history.length - 1];
  const prev = history[history.length - 2];
  const change = +(latest.close - prev.close).toFixed(2);
  const changePercent = +((change / prev.close) * 100).toFixed(2);

  return {
    symbol: symbol.toUpperCase(),
    price: latest.close,
    change,
    changePercent,
    volume: latest.volume,
    high: latest.high,
    low: latest.low,
    open: latest.open,
    previousClose: prev.close,
    updatedAt: latest.date,
  };
}

export async function tcbsFetchCompanyOverview(
  symbol: string
): Promise<TcbsOverview | null> {
  try {
    const { data } = await tcbsApi.get(
      `/tcanalysis/v1/ticker/${symbol.toUpperCase()}/overview`
    );
    return data;
  } catch {
    return null;
  }
}

export async function tcbsSearchStocks(
  query: string
): Promise<TopStock[]> {
  const history = await Promise.allSettled(
    ["VNM", "VIC", "VHM", "HPG", "FPT", "MBB", "MSN", "VCB", "TCB", "SSI"]
      .filter((s) => s.includes(query.toUpperCase()))
      .map(async (symbol) => {
        const price = await tcbsFetchStockPrice(symbol);
        const overview = await tcbsFetchCompanyOverview(symbol);
        return {
          symbol: price.symbol,
          companyName: overview?.shortName || symbol,
          price: price.price,
          change: price.change,
          changePercent: price.changePercent,
          volume: price.volume,
        };
      })
  );

  return history
    .filter((r): r is PromiseFulfilledResult<TopStock> => r.status === "fulfilled")
    .map((r) => r.value);
}
