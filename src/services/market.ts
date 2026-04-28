import type { MarketIndex, TopStock, StockPrice, HistoricalPrice } from "@/types";
import { isMockEnabled } from "./api-client";
import {
  mockFetchMarketIndices,
  mockFetchTopGainers,
  mockFetchTopLosers,
  mockFetchTopVolume,
  mockFetchStockPrice,
  mockFetchHistoricalPrices,
  mockSearchStocks,
} from "./providers/mock";
import {
  tcbsFetchStockPrice,
  tcbsFetchHistoricalPrices,
  tcbsSearchStocks,
} from "./providers/tcbs";
import {
  ssiFetchMarketIndices,
  ssiFetchTopGainers,
  ssiFetchTopLosers,
  ssiFetchTopVolume,
} from "./providers/ssi";

async function withFallback<T>(
  realFn: () => Promise<T>,
  mockFn: () => Promise<T>
): Promise<T> {
  if (isMockEnabled) return mockFn();
  try {
    return await realFn();
  } catch (err) {
    console.warn("[Ameizin] Real API failed, falling back to mock:", err);
    return mockFn();
  }
}

export function fetchMarketIndices(): Promise<MarketIndex[]> {
  return withFallback(ssiFetchMarketIndices, mockFetchMarketIndices);
}

export function fetchTopGainers(): Promise<TopStock[]> {
  return withFallback(ssiFetchTopGainers, mockFetchTopGainers);
}

export function fetchTopLosers(): Promise<TopStock[]> {
  return withFallback(ssiFetchTopLosers, mockFetchTopLosers);
}

export function fetchTopVolume(): Promise<TopStock[]> {
  return withFallback(ssiFetchTopVolume, mockFetchTopVolume);
}

export function fetchStockPrice(symbol: string): Promise<StockPrice> {
  return withFallback(
    () => tcbsFetchStockPrice(symbol),
    () => mockFetchStockPrice(symbol)
  );
}

export function fetchHistoricalPrices(
  symbol: string,
  days: number = 90
): Promise<HistoricalPrice[]> {
  return withFallback(
    () => tcbsFetchHistoricalPrices(symbol, days),
    () => mockFetchHistoricalPrices(symbol, days)
  );
}

export function searchStocks(query: string): Promise<TopStock[]> {
  return withFallback(
    () => tcbsSearchStocks(query),
    () => mockSearchStocks(query)
  );
}
