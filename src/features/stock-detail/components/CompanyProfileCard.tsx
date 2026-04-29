"use client";

import { Card, Descriptions, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";
import type { CompanyProfile } from "@/types";

const { Title } = Typography;

interface DisplayField {
  key: string;
  label: string;
  format?: (val: string | number) => React.ReactNode;
}

function fmtNumber(val: string | number): React.ReactNode {
  if (typeof val === "number") return val.toLocaleString("vi-VN");
  return val;
}

function fmtPercent(val: string | number): React.ReactNode {
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return String(val);
  return `${(n * 100).toFixed(2)}%`;
}

function fmtPrice(val: string | number): React.ReactNode {
  const n = typeof val === "string" ? parseFloat(String(val).replace(/\./g, "").replace(",", ".")) : val;
  if (isNaN(n)) return String(val);
  return n.toLocaleString("vi-VN");
}

function fmtMarketCap(val: string | number): React.ReactNode {
  const n = typeof val === "number" ? val : parseFloat(String(val).replace(/\./g, ""));
  if (isNaN(n)) return String(val);
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} nghìn tỷ`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} tỷ`;
  return n.toLocaleString("vi-VN");
}

const DISPLAY_FIELDS: DisplayField[] = [
  { key: "organ_name", label: "Tên công ty" },
  { key: "companyName", label: "Tên công ty" },
  { key: "organ_short_name", label: "Tên viết tắt" },
  { key: "shortName", label: "Tên viết tắt" },
  { key: "short_name", label: "Tên viết tắt" },
  { key: "com_group_code", label: "Sàn" },
  { key: "exchange", label: "Sàn" },
  { key: "industry", label: "Ngành" },
  { key: "industry_name", label: "Ngành" },
  { key: "sector", label: "Lĩnh vực" },
  { key: "listing_date", label: "Ngày niêm yết" },
  { key: "listingDate", label: "Ngày niêm yết" },
  { key: "current_price", label: "Giá hiện tại", format: fmtPrice },
  { key: "market_cap", label: "Vốn hóa", format: fmtMarketCap },
  { key: "issue_share", label: "SL CP phát hành", format: fmtNumber },
  { key: "rating", label: "Đánh giá" },
  { key: "target_price", label: "Giá mục tiêu", format: fmtPrice },
  { key: "highest_price1_year", label: "Giá cao nhất 1 năm", format: fmtPrice },
  { key: "lowest_price1_year", label: "Giá thấp nhất 1 năm", format: fmtPrice },
  { key: "foreigner_percentage", label: "Tỷ lệ SHNN", format: fmtPercent },
  { key: "state_percentage", label: "Tỷ lệ sở hữu NN", format: fmtPercent },
  { key: "dividend_per_share_tsr", label: "Cổ tức/CP", format: fmtNumber },
  { key: "charter_capital", label: "Vốn điều lệ", format: fmtNumber },
  { key: "no_employees", label: "Số nhân viên", format: fmtNumber },
  { key: "employees", label: "Số nhân viên", format: fmtNumber },
  { key: "website", label: "Website" },
];

function getCompanyName(profile: CompanyProfile): string {
  return (
    (profile.organ_name as string) ||
    profile.companyName ||
    (profile.company_name as string) ||
    profile.symbol ||
    ""
  );
}

function getOverview(profile: CompanyProfile): string | undefined {
  return (profile.company_profile as string) || profile.overview || undefined;
}

interface Props {
  profile: CompanyProfile;
}

export function CompanyProfileCard({ profile }: Props) {
  const shownLabels = new Set<string>();
  const entries: { label: string; value: string | number; format?: (val: string | number) => React.ReactNode }[] = [];

  for (const field of DISPLAY_FIELDS) {
    const val = profile[field.key];
    if (val === null || val === undefined || val === "" || shownLabels.has(field.label)) continue;
    shownLabels.add(field.label);
    entries.push({ label: field.label, value: val as string | number, format: field.format });
  }

  const overview = getOverview(profile);

  return (
    <Card>
      <Title level={5} style={{ color: "#fff", margin: 0, marginBottom: 16 }}>
        <BankOutlined className="mr-2" />
        Thông tin công ty — {getCompanyName(profile)}
      </Title>
      <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
        {entries.map((entry) => (
          <Descriptions.Item key={entry.label} label={entry.label}>
            {entry.label === "Website" && typeof entry.value === "string" ? (
              <a
                href={String(entry.value).startsWith("http") ? String(entry.value) : `https://${entry.value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                {String(entry.value)}
              </a>
            ) : entry.format ? (
              entry.format(entry.value)
            ) : (
              String(entry.value)
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>
      {overview && (
        <div className="mt-4">
          <Title level={5} style={{ color: "#fff", margin: 0, marginBottom: 8 }}>
            Giới thiệu
          </Title>
          <p className="text-gray-300 text-sm leading-relaxed">{overview}</p>
        </div>
      )}
    </Card>
  );
}
