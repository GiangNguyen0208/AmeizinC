"use client";

import { Input, Space, Typography } from "antd";
import {
  SearchOutlined,
  StockOutlined,
  StarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title } = Typography;

export function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/stock/${value.trim().toUpperCase()}`);
      setSearchValue("");
    }
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

        <Input.Search
          placeholder="Nhập mã CK (VD: VNM, FPT...)"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 360 }}
          allowClear
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
