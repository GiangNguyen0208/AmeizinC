"use client";

import { Typography, Empty, Card } from "antd";
import { StarOutlined } from "@ant-design/icons";
import Link from "next/link";
import { WatchlistTable } from "./components/WatchlistTable";
import { useWatchlistPrices } from "./hooks/useWatchlistData";
import type { StockPrice } from "@/types";

const { Title } = Typography;

export function Watchlist() {
  const { data, isLoading, isEmpty } = useWatchlistPrices();

  return (
    <div className="space-y-6">
      <Title level={3} style={{ color: "#fff", margin: 0 }}>
        <StarOutlined className="mr-2" />
        Watchlist
      </Title>

      {isEmpty ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-400">
                Chưa có mã nào trong watchlist.{" "}
                <Link href="/" className="text-blue-400">
                  Về trang chủ
                </Link>{" "}
                để thêm mã theo dõi.
              </span>
            }
          />
        </Card>
      ) : (
        <Card>
          <WatchlistTable data={data as StockPrice[]} loading={isLoading} />
        </Card>
      )}
    </div>
  );
}
