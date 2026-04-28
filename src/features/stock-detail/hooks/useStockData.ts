"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStockPrice, fetchHistoricalPrices } from "@/services";

export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ["stock-price", symbol],
    queryFn: () => fetchStockPrice(symbol),
    enabled: !!symbol,
  });
}

export function useHistoricalPrices(symbol: string, days: number = 90) {
  return useQuery({
    queryKey: ["historical-prices", symbol, days],
    queryFn: () => fetchHistoricalPrices(symbol, days),
    enabled: !!symbol,
  });
}
