"use client";

import { Button, Popconfirm, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { StockPrice } from "@/types";
import { formatPrice, formatVolume, formatPercent, formatChange, getChangeColor } from "@/utils";
import { useAppStore } from "@/stores/app-store";

export function WatchlistTable({ data, loading }: { data: StockPrice[]; loading: boolean }) {
  const removeFromWatchlist = useAppStore((state) => state.removeFromWatchlist);

  const columns: ColumnsType<StockPrice> = [
    {
      title: "Mã CK",
      dataIndex: "symbol",
      key: "symbol",
      width: 82,
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
      width: 112,
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
      responsive: ["sm"],
      render: (val: number) => (
        <span style={{ color: getChangeColor(val) }}>{formatChange(val)}</span>
      ),
    },
    {
      title: "%",
      dataIndex: "changePercent",
      key: "changePercent",
      align: "right",
      width: 90,
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
      width: 56,
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
      size="small"
      tableLayout="fixed"
    />
  );
}
