"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { FinancialRatios } from "@/types";

interface Props {
  ratios: FinancialRatios[];
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
}

interface ChartClickState {
  activePayload?: Array<{ payload?: FinancialRatios }>;
}

export function FinanceTrendChart({ ratios, onSelectPeriod }: Props) {
  const chartData = [...ratios].reverse();
  const barSize = chartData.length > 16 ? 10 : chartData.length > 10 ? 14 : 20;
  const handleClick = (state: unknown) => {
    const chartState = state as ChartClickState;
    const period = chartState.activePayload?.[0]?.payload?.period;
    if (period) onSelectPeriod?.(period);
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={chartData} onClick={handleClick}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="period"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          minTickGap={12}
        />
        <YAxis
          yAxisId="amount"
          orientation="left"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(val: number) => {
            if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(0)}K tỷ`;
            return `${val.toFixed(0)} tỷ`;
          }}
        />
        <YAxis
          yAxisId="pct"
          orientation="right"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(val: number) => `${val}%`}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 8,
            color: "#f9fafb",
          }}
          formatter={(value, name) => {
            const num = Number(value);
            if (name === "netMargin" || name === "roe") return [`${num?.toFixed(2)}%`, name === "netMargin" ? "Biên LN ròng" : "ROE"];
            return [`${num?.toLocaleString("vi-VN")} tỷ`, name === "revenue" ? "Doanh thu" : "LNST"];
          }}
        />
        <Legend
          formatter={(value: string) => {
            const map: Record<string, string> = { revenue: "Doanh thu", netProfit: "LNST", netMargin: "Biên LN ròng", roe: "ROE" };
            return map[value] || value;
          }}
        />
        <Bar yAxisId="amount" dataKey="revenue" fill="#3b82f6" opacity={0.7} barSize={barSize} />
        <Bar yAxisId="amount" dataKey="netProfit" fill="#22c55e" opacity={0.7} barSize={barSize} />
        <Line yAxisId="pct" type="monotone" dataKey="netMargin" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
        <Line yAxisId="pct" type="monotone" dataKey="roe" stroke="#f472b6" strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
