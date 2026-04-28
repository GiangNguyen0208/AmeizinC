"use client";

import { StockDetail } from "@/features/stock-detail";

export function StockDetailPage({ symbol }: { symbol: string }) {
  return <StockDetail symbol={symbol} />;
}
