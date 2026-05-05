"use client";

import { Select, Tag, Typography } from "antd";
import { useMemo, useState } from "react";
import type { FinancialRatios } from "@/types";
import { formatBillion, getChangeColor } from "@/utils";

const { Text } = Typography;

interface Props {
  ratios: FinancialRatios[];
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
}

function fmtPct(value: number | null): string {
  if (value === null) return "N/A";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function GrowthTag({ value }: { value: number | null }) {
  if (value === null) {
    return <Tag>Chưa có dữ liệu YoY</Tag>;
  }

  return (
    <Tag color={value > 0 ? "success" : value < 0 ? "error" : "warning"}>
      {fmtPct(value)}
    </Tag>
  );
}

function MetricItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: number | null;
}) {
  return (
    <div className="rounded-md border border-gray-800 bg-gray-950/40 px-4 py-3">
      <Text className="block text-xs uppercase tracking-normal text-gray-400">{label}</Text>
      <div
        className="mt-1 text-lg font-semibold text-white"
        style={typeof tone === "number" ? { color: getChangeColor(tone) } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

export function QuarterFinancialDetail({ ratios, selectedPeriod, onSelectPeriod }: Props) {
  const newestPeriod = ratios[0]?.period;
  const [localPeriod, setLocalPeriod] = useState(newestPeriod);
  const requestedPeriod = selectedPeriod ?? localPeriod ?? newestPeriod;

  const selected = useMemo(
    () => ratios.find((ratio) => ratio.period === requestedPeriod) ?? ratios[0],
    [requestedPeriod, ratios],
  );

  if (!selected) {
    return null;
  }

  const handleChange = (period: string) => {
    setLocalPeriod(period);
    onSelectPeriod?.(period);
  };

  return (
    <div className="mt-4 border-t border-gray-800 pt-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text className="block text-sm text-gray-400">Chi tiết từng quý</Text>
          <div className="text-xl font-semibold text-white">{selected.period}</div>
        </div>
        <Select
          value={selected.period}
          onChange={handleChange}
          className="w-full sm:w-40"
          options={ratios.map((ratio) => ({ label: ratio.period, value: ratio.period }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricItem label="Doanh thu" value={formatBillion(selected.revenue)} />
        <MetricItem label="LNST" value={formatBillion(selected.netProfit)} />
        <MetricItem label="Lợi nhuận gộp" value={formatBillion(selected.grossProfit)} />
        <MetricItem label="LN hoạt động" value={formatBillion(selected.operatingProfit)} />
        <MetricItem label="Biên LN ròng" value={fmtPct(selected.netMargin)} tone={selected.netMargin} />
        <MetricItem label="ROE" value={fmtPct(selected.roe)} tone={selected.roe} />
        <MetricItem label="ROA" value={fmtPct(selected.roa)} tone={selected.roa} />
        <MetricItem label="Tổng tài sản" value={formatBillion(selected.totalAssets)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400">Tăng trưởng YoY:</span>
        <span className="text-sm text-gray-300">Doanh thu</span>
        <GrowthTag value={selected.revenueGrowthYoY} />
        <span className="text-sm text-gray-300">LNST</span>
        <GrowthTag value={selected.netProfitGrowthYoY} />
      </div>
    </div>
  );
}
