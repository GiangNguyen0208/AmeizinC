"use client";

import { Card, Typography, Segmented } from "antd";
import { useState } from "react";
import { PriceHeader } from "./components/PriceHeader";
import { PriceChart } from "@/components/charts/PriceChart";
import { useStockPrice, useHistoricalPrices } from "./hooks/useStockData";
import { LoadingState, ErrorState } from "@/components/ui";

const { Title } = Typography;

const PERIOD_OPTIONS = [
  { label: "1 tháng", value: 30 },
  { label: "3 tháng", value: 90 },
  { label: "6 tháng", value: 180 },
  { label: "1 năm", value: 365 },
];

interface StockDetailProps {
  symbol: string;
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [period, setPeriod] = useState(90);
  const { data: price, isLoading: loadingPrice, error: priceError, refetch } = useStockPrice(symbol);
  const { data: history, isLoading: loadingHistory } = useHistoricalPrices(symbol, period);

  if (loadingPrice) return <LoadingState />;
  if (priceError) return <ErrorState message="Không tìm thấy mã cổ phiếu" onRetry={refetch} />;
  if (!price) return null;

  return (
    <div className="space-y-6">
      <PriceHeader data={price} />

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={5} style={{ color: "#fff", margin: 0 }}>
            Biểu đồ giá — {symbol}
          </Title>
          <Segmented
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(val) => setPeriod(val as number)}
          />
        </div>
        {loadingHistory ? (
          <LoadingState tip="Đang tải biểu đồ..." />
        ) : history ? (
          <PriceChart data={history} />
        ) : null}
      </Card>
    </div>
  );
}
