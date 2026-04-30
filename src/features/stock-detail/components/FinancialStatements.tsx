"use client";

import { Card, Segmented, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { FinanceData, FinanceRecord } from "@/types";
import { getChangeColor } from "@/utils";

const { Text, Title } = Typography;

type StatementType = "incomeStatement" | "balanceSheet" | "cashFlow";
type PeriodWindow = "4" | "8" | "12" | "all";

const STATEMENT_OPTIONS = [
  { label: "KQKD", value: "incomeStatement" as StatementType },
  { label: "CĐKT", value: "balanceSheet" as StatementType },
  { label: "LCTT", value: "cashFlow" as StatementType },
];

const PERIOD_OPTIONS = [
  { label: "4 quý", value: "4" },
  { label: "8 quý", value: "8" },
  { label: "12 quý", value: "12" },
  { label: "Tất cả", value: "all" },
];

const SKIP_KEYS = new Set(["year", "yearReport", "quarter", "lengthReport", "symbol", "ticker"]);

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

type RowData = Record<string, string | number | null>;

interface Props {
  data: FinanceData;
}

function formatFinancialValue(val: string | number | null): ReactNode {
  if (val === null || val === undefined) return <span className="text-gray-500">-</span>;
  if (typeof val === "string") return val;

  const valueInBillion = Math.abs(val) >= 1e9 ? val / 1e9 : val;
  const formatted = valueInBillion.toLocaleString("vi-VN", {
    maximumFractionDigits: 3,
  });

  return <span style={valueInBillion < 0 ? { color: getChangeColor(valueInBillion) } : undefined}>{formatted}</span>;
}

function isNewFormat(records: FinanceRecord[]): boolean {
  return records.length > 0 && "item_id" in records[0];
}

function getQuarterColumns(records: FinanceRecord[]): string[] {
  if (!records.length) return [];
  return Object.keys(records[0])
    .filter((key) => /^\d{4}-Q\d$/.test(key))
    .sort()
    .reverse();
}

function formatQuarterLabel(key: string): string {
  const match = key.match(/^(\d{4})-Q(\d)$/);
  if (!match) return key;
  return `Q${match[2]}/${match[1]}`;
}

function getPeriodLabel(record: FinanceRecord): string {
  const year = record.year || record.yearReport || "";
  const quarter = record.quarter || record.lengthReport || "";
  return quarter ? `Q${quarter}/${year}` : `${year}`;
}

function limitPeriods<T>(periods: T[], periodWindow: PeriodWindow): T[] {
  return periodWindow === "all" ? periods : periods.slice(0, Number(periodWindow));
}

export function FinancialStatements({ data }: Props) {
  const [stmtType, setStmtType] = useState<StatementType>("incomeStatement");
  const [periodWindow, setPeriodWindow] = useState<PeriodWindow>("8");
  const records = data[stmtType];

  const table = useMemo(() => {
    if (!records.length) {
      return {
        columns: [] as ColumnsType<RowData>,
        dataSource: [] as RowData[],
        totalPeriods: 0,
        visiblePeriods: 0,
      };
    }

    if (isNewFormat(records)) {
      const quarters = getQuarterColumns(records);
      const visibleQuarters = limitPeriods(quarters, periodWindow);

      const columns: ColumnsType<RowData> = [
        {
          title: "Chỉ tiêu",
          dataIndex: "label",
          key: "label",
          fixed: "left",
          width: 240,
          render: (val: string) => <span className="font-medium">{val}</span>,
        },
        ...visibleQuarters.map((quarter) => ({
          title: formatQuarterLabel(quarter),
          dataIndex: quarter,
          key: quarter,
          align: "right" as const,
          width: 120,
          render: formatFinancialValue,
        })),
      ];

      const dataSource = records.map((record, idx) => {
        const row: RowData = {
          key: String(record.item_id || idx),
          label: String(record.item || record.item_en || record.item_id || ""),
        };
        for (const quarter of visibleQuarters) {
          row[quarter] = record[quarter] ?? null;
        }
        return row;
      });

      return {
        columns,
        dataSource,
        totalPeriods: quarters.length,
        visiblePeriods: visibleQuarters.length,
      };
    }

    const visibleRecords = limitPeriods(records, periodWindow);
    const allKeys = Object.keys(records[0]).filter((key) => !SKIP_KEYS.has(key));

    const columns: ColumnsType<RowData> = [
      {
        title: "Chỉ tiêu",
        dataIndex: "label",
        key: "label",
        fixed: "left",
        width: 220,
        render: (val: string) => <span className="font-medium">{val}</span>,
      },
      ...visibleRecords.map((record, idx) => ({
        title: getPeriodLabel(record),
        dataIndex: `p${idx}`,
        key: `p${idx}`,
        align: "right" as const,
        width: 120,
        render: formatFinancialValue,
      })),
    ];

    const dataSource = allKeys.map((key) => {
      const row: RowData = {
        key,
        label: LABEL_MAP[key] || key,
      };
      visibleRecords.forEach((record, idx) => {
        row[`p${idx}`] = record[key] ?? null;
      });
      return row;
    });

    return {
      columns,
      dataSource,
      totalPeriods: records.length,
      visiblePeriods: visibleRecords.length,
    };
  }, [periodWindow, records]);

  if (!records.length) {
    return (
      <Card>
        <Title level={5} style={{ color: "#fff", margin: 0 }}>
          Báo cáo tài chính
        </Title>
        <p className="mt-4 text-gray-400">Chưa có dữ liệu BCTC</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Title level={5} style={{ color: "#fff", margin: 0 }}>
            Báo cáo tài chính
          </Title>
          <Text className="text-xs text-gray-400">
            Hiển thị {table.visiblePeriods}/{table.totalPeriods} quý gần nhất · Đơn vị: tỷ đồng
          </Text>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Segmented
            options={STATEMENT_OPTIONS}
            value={stmtType}
            onChange={(val) => setStmtType(val as StatementType)}
          />
          <Segmented
            options={PERIOD_OPTIONS}
            value={periodWindow}
            onChange={(val) => setPeriodWindow(val as PeriodWindow)}
          />
        </div>
      </div>

      <Table
        columns={table.columns}
        dataSource={table.dataSource}
        rowKey="key"
        pagination={false}
        size="small"
        sticky
        tableLayout="fixed"
        scroll={{ x: 240 + table.visiblePeriods * 120 }}
      />
    </Card>
  );
}
