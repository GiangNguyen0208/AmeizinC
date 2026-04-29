"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FinancialRatios } from "@/types";
import { getChangeColor } from "@/utils";

const { Title } = Typography;

function fmtPct(val: number | null): React.ReactNode {
  if (val === null) return <span className="text-gray-500">—</span>;
  return (
    <span style={{ color: getChangeColor(val) }}>
      {val > 0 ? "+" : ""}{val.toFixed(2)}%
    </span>
  );
}

function fmtBil(val: number): string {
  if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(1)}K tỷ`;
  return `${val.toFixed(0)} tỷ`;
}

const columns: ColumnsType<FinancialRatios> = [
  { title: "Kỳ", dataIndex: "period", key: "period", fixed: "left", width: 90 },
  {
    title: "Doanh thu",
    dataIndex: "revenue",
    key: "revenue",
    align: "right",
    render: fmtBil,
  },
  {
    title: "LNST",
    dataIndex: "netProfit",
    key: "netProfit",
    align: "right",
    render: fmtBil,
  },
  {
    title: "Biên LN ròng",
    dataIndex: "netMargin",
    key: "netMargin",
    align: "right",
    render: fmtPct,
  },
  {
    title: "ROA",
    dataIndex: "roa",
    key: "roa",
    align: "right",
    render: fmtPct,
  },
  {
    title: "ROE",
    dataIndex: "roe",
    key: "roe",
    align: "right",
    render: fmtPct,
  },
  {
    title: "DT tăng trưởng YoY",
    dataIndex: "revenueGrowthYoY",
    key: "revenueGrowthYoY",
    align: "right",
    render: (val: number | null) =>
      val !== null ? (
        <Tag color={val > 0 ? "success" : val < 0 ? "error" : "warning"}>
          {val > 0 ? "+" : ""}{val.toFixed(2)}%
        </Tag>
      ) : (
        <span className="text-gray-500">—</span>
      ),
  },
  {
    title: "LNST tăng trưởng YoY",
    dataIndex: "netProfitGrowthYoY",
    key: "netProfitGrowthYoY",
    align: "right",
    render: (val: number | null) =>
      val !== null ? (
        <Tag color={val > 0 ? "success" : val < 0 ? "error" : "warning"}>
          {val > 0 ? "+" : ""}{val.toFixed(2)}%
        </Tag>
      ) : (
        <span className="text-gray-500">—</span>
      ),
  },
];

interface Props {
  ratios: FinancialRatios[];
}

export function FinancialRatiosCard({ ratios }: Props) {
  return (
    <Card>
      <Title level={5} style={{ color: "#fff", margin: 0, marginBottom: 16 }}>
        Chỉ số tài chính
      </Title>
      <Table
        columns={columns}
        dataSource={ratios}
        rowKey="period"
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
