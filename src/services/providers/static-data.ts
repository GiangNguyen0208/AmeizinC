import type { MarketIndex, TopStock, StockPrice, HistoricalPrice, CrawlMeta } from "@/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface CrawledData<T> {
  data: T;
  crawledAt: string;
}

async function fetchJSON<T>(filename: string): Promise<T> {
  const res = await fetch(`${basePath}/data/${filename}`);
  if (!res.ok) throw new Error(`Failed to fetch ${filename}: ${res.status}`);
  return res.json();
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
  const json = await fetchJSON<CrawledData<Record<string, StockPrice>>>("stock-prices.json");
  const stock = json.data[symbol.toUpperCase()];
  if (!stock) throw new Error(`Stock ${symbol} not found`);
  return stock;
}

export async function staticFetchHistoricalPrices(symbol: string, days: number = 90): Promise<HistoricalPrice[]> {
  const json = await fetchJSON<{ symbol: string; data: HistoricalPrice[]; crawledAt: string }>(
    `history-${symbol.toUpperCase()}.json`
  );
  if (days >= 365) return json.data;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return json.data.filter((h) => h.date >= cutoffStr);
}

export async function staticSearchStocks(query: string): Promise<TopStock[]> {
  const json = await fetchJSON<CrawledData<Record<string, StockPrice>>>("stock-prices.json");
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

export async function staticFetchMeta(): Promise<CrawlMeta> {
  return fetchJSON<CrawlMeta>("_meta.json");
}

export async function staticFetchAllStockPrices(): Promise<StockPrice[]> {
  const json = await fetchJSON<CrawledData<Record<string, StockPrice>>>("stock-prices.json");
  return Object.values(json.data);
}
