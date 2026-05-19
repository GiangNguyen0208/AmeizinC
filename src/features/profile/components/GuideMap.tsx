"use client";

import { useState } from "react";
import { Card, Tag } from "antd";
import {
  LineChartOutlined,
  BarChartOutlined,
  FundOutlined,
  SwapOutlined,
  RiseOutlined,
  DashboardOutlined,
  StockOutlined,
  CalculatorOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import { GUIDE_TREE, GUIDE_CHARACTERS } from "../data/guide-content";
import { GuideCharacter } from "./GuideCharacter";
import type { GuideNode } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
  LineChartOutlined: <LineChartOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  FundOutlined: <FundOutlined />,
  SwapOutlined: <SwapOutlined />,
  RiseOutlined: <RiseOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  StockOutlined: <StockOutlined />,
  CalculatorOutlined: <CalculatorOutlined />,
  DollarOutlined: <DollarOutlined />,
  PercentageOutlined: <PercentageOutlined />,
  BankOutlined: <BankOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  ClockCircleOutlined: <ClockCircleOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  GlobalOutlined: <GlobalOutlined />,
  SlidersOutlined: <SlidersOutlined />,
};

const CATEGORY_COLORS: Record<string, string> = {
  indices: "#f59e0b",
  technical: "#3b82f6",
  fundamental: "#8b5cf6",
  trading: "#10b981",
};

export function GuideMap() {
  const [selectedNode, setSelectedNode] = useState<GuideNode | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["indices"]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.05) 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {GUIDE_TREE.label}
        </h2>
        <p className="text-gray-400">
          Click vào các chủ đề bên dưới để nghe giải thích từ các chuyên gia
        </p>
        <div className="flex justify-center gap-4 mt-4">
          {Object.values(GUIDE_CHARACTERS).map((char) => (
            <div key={char.name} className="flex items-center gap-1.5 text-sm text-gray-400">
              <span className="text-lg">{char.emoji}</span>
              <span>{char.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GUIDE_TREE.children?.map((category) => {
          const color = CATEGORY_COLORS[category.id] || "#6b7280";
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <Card
              key={category.id}
              className="border-gray-700! cursor-pointer transition-all duration-300"
              style={{
                background: isExpanded
                  ? `linear-gradient(135deg, ${color}10 0%, #1f293780 100%)`
                  : "#1f293780",
                borderColor: isExpanded ? `${color}40` : undefined,
              }}
              styles={{
                header: {
                  borderBottom: isExpanded ? `1px solid ${color}30` : "1px solid #374151",
                },
                body: { padding: isExpanded ? "16px" : "0px" },
              }}
              title={
                <div
                  className="flex items-center gap-2"
                  style={{ color: isExpanded ? color : "#d1d5db" }}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="text-lg">{ICON_MAP[category.icon]}</span>
                  <span className="font-semibold">{category.label}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {category.children?.length || 0} chủ đề
                  </span>
                </div>
              }
            >
              {isExpanded && (
                <div className="flex flex-wrap gap-2">
                  {category.children?.map((concept) => (
                    <Tag
                      key={concept.id}
                      className="cursor-pointer px-3 py-1.5 text-sm transition-all duration-200 m-0!"
                      style={{
                        background: `${color}15`,
                        borderColor: `${color}40`,
                        color: "#e5e7eb",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 12px ${color}40`;
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(concept);
                      }}
                    >
                      <span className="mr-1.5">{ICON_MAP[concept.icon]}</span>
                      {concept.label}
                    </Tag>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Character overlay */}
      {selectedNode?.content && (
        <GuideCharacter
          content={selectedNode.content}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
