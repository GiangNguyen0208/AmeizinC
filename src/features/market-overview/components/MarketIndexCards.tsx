"use client";

import { Card, Col, Row, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useMarketIndices } from "../hooks/useMarketData";
import { formatVolume } from "@/utils";
import { LoadingState } from "@/components/ui";

export function MarketIndexCards() {
  const { data: indices, isLoading } = useMarketIndices();

  if (isLoading) return <LoadingState />;

  return (
    <Row gutter={[16, 16]}>
      {indices?.map((index) => {
        const isUp = index.change >= 0;
        return (
          <Col xs={24} sm={8} key={index.name}>
            <Card hoverable>
              <Statistic
                title={index.name}
                value={index.value}
                precision={2}
                valueStyle={{ color: isUp ? "#22c55e" : "#ef4444" }}
                prefix={isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix={
                  <span className="text-sm">
                    {isUp ? "+" : ""}
                    {index.change.toFixed(2)} ({isUp ? "+" : ""}
                    {index.changePercent.toFixed(2)}%)
                  </span>
                }
              />
              <div className="mt-2 text-gray-400 text-xs">
                KL: {formatVolume(index.volume)}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
