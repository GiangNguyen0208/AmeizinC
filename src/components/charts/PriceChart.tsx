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
import type { HistoricalPrice, NewsArticle } from "@/types";
import { formatPrice, formatVolume } from "@/utils";

interface PriceChartProps {
  data: HistoricalPrice[];
  news?: NewsArticle[];
  onSelectNews?: (news: NewsArticle) => void;
}

interface CustomNewsDotProps {
  cx?: number;
  cy?: number;
  payload?: { date: string; [key: string]: unknown };
  news?: NewsArticle[];
  onSelectNews?: (news: NewsArticle) => void;
}

export function CustomNewsDot(props: CustomNewsDotProps) {
  const { cx, cy, payload, news, onSelectNews } = props;
  if (!news || cx === undefined || cy === undefined || !payload) return null;

  // Format date to compare (YYYY-MM-DD)
  const priceDate = new Date(payload.date).toISOString().split("T")[0];

  // Find articles for this date with relevance >= 0.7
  const dayArticles = news.filter((art) => {
    const artDate = new Date(art.publishedAt).toISOString().split("T")[0];
    return artDate === priceDate && (art.relevanceScore ?? 0) >= 0.7;
  });

  if (dayArticles.length === 0) return null;

  // Sort by relevance score to get the most important news of the day
  const topArticle = [...dayArticles].sort(
    (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)
  )[0];

  let dotColor = "#9ca3af"; // Gray
  if (topArticle.sentiment === "positive") dotColor = "#10b981"; // Green
  else if (topArticle.sentiment === "negative") dotColor = "#ef4444"; // Red

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectNews) onSelectNews(topArticle);
      }}
      style={{ cursor: "pointer" }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill={dotColor}
        stroke="#111827"
        strokeWidth={2}
        className="transition-all hover:scale-130"
      />
      {/* Small dot inside to make it pop */}
      <circle cx={cx} cy={cy} r={2} fill="#fff" />
    </g>
  );
}

export function PriceChart({ data, news, onSelectNews }: PriceChartProps) {
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
          dot={<CustomNewsDot news={news} onSelectNews={onSelectNews} />}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
