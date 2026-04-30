import type { MarketIndex, TopStock, StockPrice, HistoricalPrice, CrawlMeta, FinanceData, CompanyProfile } from "@/types";
import { isMockEnabled } from "./api-client";
import {
  mockFetchMarketIndices,
  mockFetchTopGainers,
  mockFetchTopLosers,
  mockFetchTopVolume,
  mockFetchStockPrice,
  mockFetchHistoricalPrices,
  mockSearchStocks,
  mockFetchMeta,
  mockFetchAllStockPrices,
  mockFetchFinanceData,
  mockFetchCompanyProfile,
  mockFetchHistoricalPricesByRange,
} from "./providers/mock";
import {
  staticFetchMarketIndices,
  staticFetchTopGainers,
  staticFetchTopLosers,
  staticFetchTopVolume,
  staticFetchStockPrice,
  staticFetchHistoricalPrices,
  staticSearchStocks,
  staticFetchMeta,
  staticFetchAllStockPrices,
  staticFetchFinanceData,
  staticFetchCompanyProfile,
  staticFetchHistoricalPricesByRange,
} from "./providers/static-data";

async function withFallback<T>(
  primaryFn: () => Promise<T>,
  mockFn: () => Promise<T>
): Promise<T> {
  if (isMockEnabled) return mockFn();
  try {
    return await primaryFn();
  } catch (err) {
    console.warn("[Ameizin] Static data failed, falling back to mock:", err);
    return mockFn();
  }
}

export function fetchMarketIndices(): Promise<MarketIndex[]> {
  return withFallback(staticFetchMarketIndices, mockFetchMarketIndices);
}

export function fetchTopGainers(): Promise<TopStock[]> {
  return withFallback(staticFetchTopGainers, mockFetchTopGainers);
}

export function fetchTopLosers(): Promise<TopStock[]> {
  return withFallback(staticFetchTopLosers, mockFetchTopLosers);
}

export function fetchTopVolume(): Promise<TopStock[]> {
  return withFallback(staticFetchTopVolume, mockFetchTopVolume);
}

export function fetchStockPrice(symbol: string): Promise<StockPrice> {
  return withFallback(
    () => staticFetchStockPrice(symbol),
    () => mockFetchStockPrice(symbol)
  );
}

export function fetchHistoricalPrices(
  symbol: string,
  days: number
): Promise<HistoricalPrice[]> {
  return withFallback(
    () => staticFetchHistoricalPrices(symbol, days),
    () => mockFetchHistoricalPrices(symbol, days)
  );
}

export function fetchHistoricalPricesByRange(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<HistoricalPrice[]> {
  return withFallback(
    () => staticFetchHistoricalPricesByRange(symbol, startDate, endDate),
    () => mockFetchHistoricalPricesByRange(symbol, startDate, endDate)
  );
}

export function searchStocks(query: string): Promise<TopStock[]> {
  return withFallback(
    () => staticSearchStocks(query),
    () => mockSearchStocks(query)
  );
}

export function fetchMeta(): Promise<CrawlMeta> {
  return withFallback(staticFetchMeta, mockFetchMeta);
}

export function fetchAllStockPrices(): Promise<StockPrice[]> {
  return withFallback(staticFetchAllStockPrices, mockFetchAllStockPrices);
}

export function fetchFinanceData(symbol: string): Promise<FinanceData> {
  return withFallback(
    () => staticFetchFinanceData(symbol),
    () => mockFetchFinanceData(symbol)
  );
}

export function fetchCompanyProfile(symbol: string): Promise<CompanyProfile> {
  return withFallback(
    () => staticFetchCompanyProfile(symbol),
    () => mockFetchCompanyProfile(symbol)
  );
}
