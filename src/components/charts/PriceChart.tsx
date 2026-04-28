"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { HistoricalPrice } from "@/types";
import { formatPrice, formatVolume } from "@/utils";

interface PriceChartProps {
  data: HistoricalPrice[];
}

export function PriceChart({ data }: PriceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(val: string) => {
            const d = new Date(val);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis
          yAxisId="price"
          orientation="right"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          domain={["auto", "auto"]}
          tickFormatter={(val: number) => formatPrice(val)}
        />
        <YAxis
          yAxisId="volume"
          orientation="left"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(val: number) => formatVolume(val)}
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
            if (name === "volume") return [formatVolume(num), "Khối lượng"];
            return [formatPrice(num), "Giá đóng cửa"];
          }}
          labelFormatter={(label) => `Ngày: ${label}`}
        />
        <Bar
          yAxisId="volume"
          dataKey="volume"
          fill="#3b82f6"
          opacity={0.3}
          barSize={4}
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="close"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
