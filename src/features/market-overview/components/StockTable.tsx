"use client";

import { Input, Slider, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { TopStock } from "@/types";
import { formatPrice, formatVolume, formatPercent, formatChange, getChangeColor } from "@/utils";

const columns: ColumnsType<TopStock> = [
  {
    title: "Mã CK",
    dataIndex: "symbol",
    key: "symbol",
    width: 82,
    sorter: (a, b) => a.symbol.localeCompare(b.symbol),
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
    width: 112,
    sorter: (a, b) => a.price - b.price,
    render: (price: number) => formatPrice(price),
  },
  {
    title: "Thay đổi",
    dataIndex: "change",
    key: "change",
    align: "right",
    responsive: ["sm"],
    sorter: (a, b) => a.change - b.change,
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
    width: 90,
    sorter: (a, b) => a.changePercent - b.changePercent,
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
    responsive: ["md"],
    sorter: (a, b) => a.volume - b.volume,
    render: (vol: number) => formatVolume(vol),
  },
];

interface StockTableProps {
  data?: TopStock[];
  loading?: boolean;
  title: string;
  filterable?: boolean;
}

export function StockTable({ data, loading, title, filterable = false }: StockTableProps) {
  const [search, setSearch] = useState("");
  const [pctRange, setPctRange] = useState<[number, number]>([-100, 100]);

  const filtered = useMemo(() => {
    if (!data || !filterable) return data;
    let result = data;
    if (search) {
      const q = search.toUpperCase();
      result = result.filter((stock) => stock.symbol.includes(q) || stock.companyName?.toUpperCase().includes(q));
    }
    if (pctRange[0] > -100 || pctRange[1] < 100) {
      result = result.filter((stock) => stock.changePercent >= pctRange[0] && stock.changePercent <= pctRange[1]);
    }
    return result;
  }, [data, filterable, search, pctRange]);

  return (
    <Table
      title={() => (
        <div>
          <span className="font-semibold text-base">{title}</span>
          {filterable && (
            <Space className="mt-2 w-full" direction="vertical" size="small">
              <Input
                placeholder="Lọc mã CK..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                allowClear
                size="small"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <span className="whitespace-nowrap text-xs text-gray-400">% thay đổi:</span>
                <Slider
                  range
                  min={-20}
                  max={20}
                  step={0.5}
                  value={pctRange}
                  onChange={(val) => setPctRange(val as [number, number])}
                  className="flex-1"
                  tooltip={{ formatter: (val) => `${val}%` }}
                />
              </div>
            </Space>
          )}
        </div>
      )}
      columns={columns}
      dataSource={filtered}
      rowKey="symbol"
      loading={loading}
      pagination={false}
      size="small"
      tableLayout="fixed"
    />
  );
}
