"use client";

import { Card, Tooltip } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStockPrices } from "@/services";

export function MarketBreadth() {
  const { data: stocks } = useQuery({
    queryKey: ["all-stock-prices"],
    queryFn: fetchAllStockPrices,
  });

  if (!stocks || stocks.length === 0) return null;

  const advancing = stocks.filter((s) => s.change > 0).length;
  const declining = stocks.filter((s) => s.change < 0).length;
  const unchanged = stocks.filter((s) => s.change === 0).length;
  const total = stocks.length;

  const advPct = (advancing / total) * 100;
  const uncPct = (unchanged / total) * 100;
  const decPct = (declining / total) * 100;

  const segments = [
    { pct: advPct, count: advancing, bg: "#22c55e", color: "#fff", label: "Tăng" },
    { pct: uncPct, count: unchanged, bg: "#fbbf24", color: "#000", label: "Đứng giá" },
    { pct: decPct, count: declining, bg: "#ef4444", color: "#fff", label: "Giảm" },
  ].filter((s) => s.count > 0);

  return (
    <Card size="small">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>Độ rộng thị trường</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{total} mã theo dõi</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 2,
          borderRadius: 6,
          overflow: "hidden",
          height: 28,
        }}
      >
        {segments.map((seg) => (
          <Tooltip
            key={seg.label}
            title={`${seg.label}: ${seg.count} mã (${seg.pct.toFixed(0)}%)`}
          >
            <div
              style={{
                width: `${seg.pct}%`,
                background: seg.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: seg.color,
                minWidth: 28,
              }}
            >
              {seg.count}
            </div>
          </Tooltip>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 12,
        }}
      >
        <span style={{ color: "#22c55e" }}>Tăng {advancing}</span>
        <span style={{ color: "#fbbf24" }}>Đứng giá {unchanged}</span>
        <span style={{ color: "#ef4444" }}>Giảm {declining}</span>
      </div>
    </Card>
  );
}
