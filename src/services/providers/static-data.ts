import type { MarketIndex, TopStock, StockPrice, HistoricalPrice, CrawlMeta } from "@/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

async function fetchJSON<T>(filename: string): Promise<T> {
  const res = await fetch(`${basePath}/data/${filename}`);
  if (!res.ok) throw new Error(`Failed to fetch ${filename}: ${res.status}`);
  return res.json();
}

interface CrawledData<T> {
  data: T;
  crawledAt: string;
}

export async function staticFetchMarketIndices(): Promise<MarketIndex[]> {
  const json = await fetchJSON<CrawledData<MarketIndex[]>>("market-indices.json");
  return json.data;
}

export async function staticFetchTopGainers(): Promise<TopStock[]> {
  const json = await fetchJSON<CrawledData<TopStock[]>>("top-gainers.json");
  return json.data;
}

export async function staticFetchTopLosers(): Promise<TopStock[]> {
  const json = await fetchJSON<CrawledData<TopStock[]>>("top-losers.json");
  return json.data;
}

export async function staticFetchTopVolume(): Promise<TopStock[]> {
  const json = await fetchJSON<CrawledData<TopStock[]>>("top-volume.json");
  return json.data;
}

export async function staticFetchStockPrice(symbol: string): Promise<StockPrice> {
  const json = await fetchJSON<CrawledData<Record<string, StockPrice>>>(
    "stock-prices.json"
  );
  const stock = json.data[symbol.toUpperCase()];
  if (!stock) throw new Error(`No data for ${symbol}`);
  return stock;
}

export async function staticFetchHistoricalPrices(
  symbol: string,
  _days: number = 90
): Promise<HistoricalPrice[]> {
  const json = await fetchJSON<CrawledData<HistoricalPrice[]>>(
    `history-${symbol.toUpperCase()}.json`
  );
  const data = json.data;
  if (_days < 365) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - _days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return data.filter((d) => d.date >= cutoffStr);
  }
  return data;
}

export async function staticFetchMeta(): Promise<CrawlMeta> {
  return fetchJSON<CrawlMeta>("_meta.json");
}

export async function staticFetchAllStockPrices(): Promise<StockPrice[]> {
  const json = await fetchJSON<CrawledData<Record<string, StockPrice>>>("stock-prices.json");
  return Object.values(json.data);
}

export async function staticSearchStocks(query: string): Promise<TopStock[]> {
  const json = await fetchJSON<CrawledData<Record<string, StockPrice>>>(
    "stock-prices.json"
  );
  const q = query.toUpperCase();
  return Object.values(json.data)
    .filter((s) => s.symbol.includes(q))
    .map((s) => ({
      symbol: s.symbol,
      companyName: s.symbol,
      price: s.price,
      change: s.change,
      changePercent: s.changePercent,
      volume: s.volume,
    }));
}
