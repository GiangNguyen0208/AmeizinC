"use client";

import { AutoComplete, Space, Typography } from "antd";
import {
  SearchOutlined,
  StockOutlined,
  StarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStockPrices } from "@/services";
import { formatPrice, formatPercent, getChangeColor } from "@/utils";

const { Title } = Typography;

export function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const { data: allStocks } = useQuery({
    queryKey: ["all-stock-prices"],
    queryFn: fetchAllStockPrices,
  });

  const options = useMemo(() => {
    if (!searchValue.trim() || !allStocks) return [];
    const q = searchValue.toUpperCase();
    return allStocks
      .filter((s) => s.symbol.includes(q))
      .slice(0, 8)
      .map((s) => ({
        value: s.symbol,
        label: (
          <div className="flex justify-between items-center">
            <span className="font-bold">{s.symbol}</span>
            <span>
              <span className="mr-2">{formatPrice(s.price)}</span>
              <span style={{ color: getChangeColor(s.changePercent) }}>
                {formatPercent(s.changePercent)}
              </span>
            </span>
          </div>
        ),
      }));
  }, [searchValue, allStocks]);

  const handleSelect = (symbol: string) => {
    router.push(`/stock/${symbol}`);
    setSearchValue("");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <StockOutlined style={{ fontSize: 24, color: "#3b82f6" }} />
          <Title level={4} style={{ margin: 0, color: "#fff" }}>
            Ameizin
          </Title>
        </Link>

        <AutoComplete
          value={searchValue}
          options={options}
          onSelect={handleSelect}
          onChange={setSearchValue}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchValue.trim()) {
              handleSelect(searchValue.trim().toUpperCase());
            }
          }}
          placeholder="Nhập mã CK (VD: VNM, FPT...)"
          style={{ maxWidth: 360, width: "100%" }}
          suffixIcon={<SearchOutlined />}
        />

        <Space size="large">
          <Link href="/" className="text-gray-300 hover:text-white no-underline flex items-center gap-1">
            <HomeOutlined /> Tổng quan
          </Link>
          <Link href="/watchlist" className="text-gray-300 hover:text-white no-underline flex items-center gap-1">
            <StarOutlined /> Watchlist
          </Link>
        </Space>
      </div>
    </header>
  );
}
