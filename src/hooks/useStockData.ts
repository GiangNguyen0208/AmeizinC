"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStockPrice, fetchHistoricalPrices, fetchHistoricalPricesByRange } from "@/services";
import { PeriodFilterValue } from "@/features/stock-detail/components/PeriodFilter";

export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ["stock-price", symbol],
    queryFn: () => fetchStockPrice(symbol),
    enabled: !!symbol,
  });
}

export function useHistoricalPrices(symbol: string, filter: PeriodFilterValue) {
  return useQuery({
    queryKey: ["historical-prices", symbol, filter],
    queryFn: () => {
      if (filter.mode === "custom") {
        return fetchHistoricalPricesByRange(
          symbol,
          filter.range.startDate,
          filter.range.endDate
        );
      }
      return fetchHistoricalPrices(symbol, filter.days);
    },
    enabled: !!symbol,
  });
}
