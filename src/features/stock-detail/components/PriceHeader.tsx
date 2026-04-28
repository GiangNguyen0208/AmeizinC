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

interface PriceHeaderProps {
  data: StockPrice;
}

export function PriceHeader({ data }: PriceHeaderProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const isUp = data.change >= 0;
  const inWatchlist = isInWatchlist(data.symbol);

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Space align="center" size="middle">
            <span className="text-2xl font-bold text-white">{data.symbol}</span>
            <Tag color={isUp ? "success" : "error"}>
              {formatPercent(data.changePercent)}
            </Tag>
          </Space>
          <div className="mt-1">
            <span className="text-3xl font-bold" style={{ color: getChangeColor(data.change) }}>
              {formatPrice(data.price)}
            </span>
            <span className="ml-3 text-lg" style={{ color: getChangeColor(data.change) }}>
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
        >
          {inWatchlist ? "Đã theo dõi" : "Theo dõi"}
        </Button>
      </div>

      <Row gutter={[24, 12]}>
        <Col xs={12} sm={6}>
          <Statistic title="Mở cửa" value={data.open} precision={2} valueStyle={{ fontSize: 16 }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Cao nhất" value={data.high} precision={2} valueStyle={{ fontSize: 16, color: "#22c55e" }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Thấp nhất" value={data.low} precision={2} valueStyle={{ fontSize: 16, color: "#ef4444" }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Khối lượng" value={data.volume} formatter={(val) => formatVolume(val as number)} valueStyle={{ fontSize: 16 }} />
        </Col>
      </Row>
    </Card>
  );
}
