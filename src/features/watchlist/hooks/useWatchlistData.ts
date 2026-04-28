"use client";

import { useQueries } from "@tanstack/react-query";
import { fetchStockPrice } from "@/services";
import { useAppStore } from "@/stores/app-store";

export function useWatchlistPrices() {
  const watchlist = useAppStore((s) => s.watchlist);

  const queries = useQueries({
    queries: watchlist.map((symbol) => ({
      queryKey: ["stock-price", symbol],
      queryFn: () => fetchStockPrice(symbol),
    })),
  });

  return {
    data: queries.map((q) => q.data).filter(Boolean),
    isLoading: queries.some((q) => q.isLoading),
    isEmpty: watchlist.length === 0,
  };
}
