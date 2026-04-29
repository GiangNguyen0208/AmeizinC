"use client";

import { Card, Table, Segmented, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import type { FinanceData, FinanceRecord } from "@/types";
import { getChangeColor } from "@/utils";

const { Title } = Typography;

type StatementType = "incomeStatement" | "balanceSheet" | "cashFlow";

const STATEMENT_OPTIONS = [
  { label: "KQKD", value: "incomeStatement" as StatementType },
  { label: "CĐKT", value: "balanceSheet" as StatementType },
  { label: "LCTT", value: "cashFlow" as StatementType },
];

const LABEL_MAP: Record<string, string> = {
  revenue: "Doanh thu",
  net_revenue: "Doanh thu thuần",
  cost_of_good_sold: "Giá vốn",
  gross_profit: "Lợi nhuận gộp",
  operation_expense: "Chi phí hoạt động",
  operation_profit: "Lợi nhuận hoạt động",
  operating_profit: "Lợi nhuận hoạt động",
  interest_expense: "Chi phí lãi vay",
  pre_tax_profit: "LNTT",
  net_profit: "LNST",
  post_tax_profit: "LNST",
  total_asset: "Tổng tài sản",
  current_asset: "Tài sản ngắn hạn",
  long_term_asset: "Tài sản dài hạn",
  total_debt: "Tổng nợ",
  current_debt: "Nợ ngắn hạn",
  long_term_debt: "Nợ dài hạn",
  equity: "Vốn chủ sở hữu",
  owner_equity: "Vốn chủ sở hữu",
  from_operation: "Dòng tiền từ HĐKD",
  from_invest: "Dòng tiền từ đầu tư",
  from_financial: "Dòng tiền từ tài chính",
  net_cash_flow: "Lưu chuyển tiền thuần",
};

const SKIP_KEYS = new Set(["year", "yearReport", "quarter", "lengthReport", "symbol", "ticker"]);

function fmtVal(val: string | number | null): React.ReactNode {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string") return val;
  if (Math.abs(val) >= 1e9) return <span style={{ color: getChangeColor(val) }}>{(val / 1e9).toFixed(1)} tỷ</span>;
  if (Math.abs(val) >= 1e6) return <span style={{ color: getChangeColor(val) }}>{(val / 1e6).toFixed(1)} triệu</span>;
  return val.toLocaleString("vi-VN");
}

function getPeriodLabel(record: FinanceRecord): string {
  const year = record.year || record.yearReport || "";
  const quarter = record.quarter || record.lengthReport || "";
  return quarter ? `Q${quarter}/${year}` : `${year}`;
}

interface Props {
  data: FinanceData;
}

export function FinancialStatements({ data }: Props) {
  const [stmtType, setStmtType] = useState<StatementType>("incomeStatement");
  const records = data[stmtType];

  if (!records.length) {
    return (
      <Card>
        <Title level={5} style={{ color: "#fff", margin: 0 }}>
          Báo cáo tài chính
        </Title>
        <p className="text-gray-400 mt-4">Chưa có dữ liệu BCTC</p>
      </Card>
    );
  }

  const allKeys = Object.keys(records[0]).filter((k) => !SKIP_KEYS.has(k));

  type RowData = Record<string, string | number | null>;
  const columns: ColumnsType<RowData> = [
    {
      title: "Chỉ tiêu",
      dataIndex: "label",
      key: "label",
      fixed: "left",
      width: 200,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    ...records.map((record, idx) => ({
      title: getPeriodLabel(record),
      dataIndex: `p${idx}`,
      key: `p${idx}`,
      align: "right" as const,
      render: fmtVal,
    })),
  ];

  const dataSource = allKeys.map((key) => {
    const row: Record<string, string | number | null> = {
      key,
      label: LABEL_MAP[key] || key,
    };
    records.forEach((record, idx) => {
      row[`p${idx}`] = record[key] ?? null;
    });
    return row;
  });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Title level={5} style={{ color: "#fff", margin: 0 }}>
          Báo cáo tài chính
        </Title>
        <Segmented
          options={STATEMENT_OPTIONS}
          value={stmtType}
          onChange={(val) => setStmtType(val as StatementType)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        size="small"
        scroll={{ x: 600 }}
      />
    </Card>
  );
}
