"use client";

import { Table, Button, Tag, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { StockPrice } from "@/types";
import { formatPrice, formatVolume, formatPercent, formatChange, getChangeColor } from "@/utils";
import { useAppStore } from "@/stores/app-store";

export function WatchlistTable({ data, loading }: { data: StockPrice[]; loading: boolean }) {
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);

  const columns: ColumnsType<StockPrice> = [
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price: number, record: StockPrice) => (
        <span style={{ color: getChangeColor(record.change) }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: "Thay đổi",
      dataIndex: "change",
      key: "change",
      align: "right",
      render: (val: number) => (
        <span style={{ color: getChangeColor(val) }}>{formatChange(val)}</span>
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
      title: "KL",
      dataIndex: "volume",
      key: "volume",
      align: "right",
      responsive: ["md"],
      render: (vol: number) => formatVolume(vol),
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_: unknown, record: StockPrice) => (
        <Popconfirm
          title="Xóa khỏi watchlist?"
          onConfirm={() => removeFromWatchlist(record.symbol)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="symbol"
      loading={loading}
      pagination={false}
    />
  );
}
