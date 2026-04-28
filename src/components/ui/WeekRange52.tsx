"use client";

import { Tooltip } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalPrices } from "@/services";
import { formatPrice } from "@/utils";

interface WeekRange52Props {
  symbol: string;
  currentPrice: number;
}

export function WeekRange52({ symbol, currentPrice }: WeekRange52Props) {
  const { data: history } = useQuery({
    queryKey: ["historical-prices", symbol, 365],
    queryFn: () => fetchHistoricalPrices(symbol, 365),
    enabled: !!symbol,
  });

  if (!history || history.length === 0) return null;

  const high52 = Math.max(...history.map((h) => h.high));
  const low52 = Math.min(...history.map((h) => h.low));
  const range = high52 - low52;
  const position =
    range > 0
      ? Math.min(100, Math.max(0, ((currentPrice - low52) / range) * 100))
      : 50;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
        Phạm vi 52 tuần
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#ef4444", whiteSpace: "nowrap" }}>
          {formatPrice(low52)}
        </span>
        <Tooltip title={`Hiện tại: ${formatPrice(currentPrice)}`}>
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: "linear-gradient(to right, #ef4444, #fbbf24, #22c55e)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${position}%`,
                top: -3,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid #3b82f6",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </Tooltip>
        <span style={{ fontSize: 12, color: "#22c55e", whiteSpace: "nowrap" }}>
          {formatPrice(high52)}
        </span>
      </div>
    </div>
  );
}
