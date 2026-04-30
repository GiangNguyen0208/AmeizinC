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
      .filter((stock) => stock.symbol.includes(q))
      .slice(0, 8)
      .map((stock) => ({
        value: stock.symbol,
        label: (
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold">{stock.symbol}</span>
            <span className="whitespace-nowrap text-right">
              <span className="mr-2">{formatPrice(stock.price)}</span>
              <span style={{ color: getChangeColor(stock.changePercent) }}>
                {formatPercent(stock.changePercent)}
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
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 px-3 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:gap-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <StockOutlined style={{ fontSize: 24, color: "#3b82f6" }} />
          <Title level={4} style={{ margin: 0, color: "#fff" }}>
            Ameizin
          </Title>
        </Link>

        <div className="order-3 w-full sm:order-none sm:max-w-[360px] sm:flex-1">
          <AutoComplete
            value={searchValue}
            options={options}
            onSelect={handleSelect}
            onChange={setSearchValue}
            onKeyDown={(event) => {
              if (event.key === "Enter" && searchValue.trim()) {
                handleSelect(searchValue.trim().toUpperCase());
              }
            }}
            placeholder="Nhập mã CK (VD: VNM, FPT...)"
            style={{ width: "100%" }}
            suffixIcon={<SearchOutlined />}
          />
        </div>

        <Space size="middle" className="shrink-0">
          <Link href="/" className="flex items-center gap-1 text-gray-300 no-underline hover:text-white">
            <HomeOutlined /> <span className="hidden sm:inline">Tổng quan</span>
          </Link>
          <Link href="/watchlist" className="flex items-center gap-1 text-gray-300 no-underline hover:text-white">
            <StarOutlined /> <span className="hidden sm:inline">Watchlist</span>
          </Link>
        </Space>
      </div>
    </header>
  );
}
