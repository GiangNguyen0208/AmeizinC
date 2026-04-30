"use client";

import { Card, Statistic, Row, Col, Button, Space, Tag } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { StockPrice } from "@/types";
import { formatPrice, formatVolume, formatChange, formatPercent, getChangeColor } from "@/utils";
import { useAppStore } from "@/stores/app-store";
import { WeekRange52 } from "@/components/ui";

interface PriceHeaderProps {
  data: StockPrice;
}

export function PriceHeader({ data }: PriceHeaderProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const isUp = data.change >= 0;
  const inWatchlist = isInWatchlist(data.symbol);

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Space align="center" size="middle">
            <span className="text-2xl font-bold text-white">{data.symbol}</span>
            <Tag color={isUp ? "success" : "error"}>
              {formatPercent(data.changePercent)}
            </Tag>
          </Space>
          <div className="mt-1 flex flex-col gap-1 sm:block">
            <span className="text-2xl font-bold sm:text-3xl" style={{ color: getChangeColor(data.change) }}>
              {formatPrice(data.price)}
            </span>
            <span className="text-base sm:ml-3 sm:text-lg" style={{ color: getChangeColor(data.change) }}>
              {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {" "}{formatChange(data.change)}
            </span>
          </div>
        </div>
        <Button
          type={inWatchlist ? "primary" : "default"}
          icon={inWatchlist ? <StarFilled /> : <StarOutlined />}
          onClick={() =>
            inWatchlist
              ? removeFromWatchlist(data.symbol)
              : addToWatchlist(data.symbol)
          }
          className="w-full sm:w-auto"
        >
          {inWatchlist ? "Đã theo dõi" : "Theo dõi"}
        </Button>
      </div>

      <Row gutter={[24, 12]}>
        <Col xs={12} sm={6}>
          <Statistic title="Mở cửa" value={data.open} formatter={(val) => formatPrice(val as number)} valueStyle={{ fontSize: 16 }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Cao nhất" value={data.high} formatter={(val) => formatPrice(val as number)} valueStyle={{ fontSize: 16, color: "#22c55e" }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Thấp nhất" value={data.low} formatter={(val) => formatPrice(val as number)} valueStyle={{ fontSize: 16, color: "#ef4444" }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Khối lượng" value={data.volume} formatter={(val) => formatVolume(val as number)} valueStyle={{ fontSize: 16 }} />
        </Col>
      </Row>

      <WeekRange52 symbol={data.symbol} currentPrice={data.price} />
    </Card>
  );
}
