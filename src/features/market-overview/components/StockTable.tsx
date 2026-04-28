"use client";

import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { TopStock } from "@/types";
import { formatPrice, formatVolume, formatPercent, formatChange, getChangeColor } from "@/utils";

const columns: ColumnsType<TopStock> = [
  {
    title: "Mã CK",
    dataIndex: "symbol",
    key: "symbol",
    render: (symbol: string) => (
      <Link href={`/stock/${symbol}`} className="font-bold text-blue-400 hover:text-blue-300">
        {symbol}
      </Link>
    ),
  },
  {
    title: "Công ty",
    dataIndex: "companyName",
    key: "companyName",
    responsive: ["md"],
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    align: "right",
    render: (price: number) => formatPrice(price),
  },
  {
    title: "Thay đổi",
    dataIndex: "change",
    key: "change",
    align: "right",
    render: (_: number, record: TopStock) => (
      <span style={{ color: getChangeColor(record.change) }}>
        {formatChange(record.change)}
      </span>
    ),
  },
  {
    title: "%",
    dataIndex: "changePercent",
    key: "changePercent",
    align: "right",
    render: (val: number) => (
      <Tag color={val > 0 ? "success" : val < 0 ? "error" : "warning"}>
        {formatPercent(val)}
      </Tag>
    ),
  },
  {
    title: "Khối lượng",
    dataIndex: "volume",
    key: "volume",
    align: "right",
    render: (vol: number) => formatVolume(vol),
  },
];

interface StockTableProps {
  data?: TopStock[];
  loading?: boolean;
  title: string;
}

export function StockTable({ data, loading, title }: StockTableProps) {
  return (
    <Table
      title={() => <span className="font-semibold text-base">{title}</span>}
      columns={columns}
      dataSource={data}
      rowKey="symbol"
      loading={loading}
      pagination={false}
      size="small"
    />
  );
}
