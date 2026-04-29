"use client";

import { Card, Descriptions, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";
import type { CompanyProfile } from "@/types";

const { Title } = Typography;

const FIELD_LABELS: Record<string, string> = {
  companyName: "Tên công ty",
  company_name: "Tên công ty",
  shortName: "Tên viết tắt",
  short_name: "Tên viết tắt",
  exchange: "Sàn",
  industry: "Ngành",
  industry_name: "Ngành",
  sector: "Lĩnh vực",
  listingDate: "Ngày niêm yết",
  listing_date: "Ngày niêm yết",
  website: "Website",
  employees: "Số nhân viên",
  no_employees: "Số nhân viên",
  charter_capital: "Vốn điều lệ",
};

const SKIP_KEYS = new Set(["symbol", "ticker", "overview", "company_short_name"]);

interface Props {
  profile: CompanyProfile;
}

export function CompanyProfileCard({ profile }: Props) {
  const entries = Object.entries(profile).filter(
    ([key, val]) => !SKIP_KEYS.has(key) && val !== null && val !== undefined && val !== ""
  );

  return (
    <Card>
      <Title level={5} style={{ color: "#fff", margin: 0, marginBottom: 16 }}>
        <BankOutlined className="mr-2" />
        Thông tin công ty — {profile.companyName || profile.symbol}
      </Title>
      <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
        {entries.map(([key, val]) => (
          <Descriptions.Item key={key} label={FIELD_LABELS[key] || key}>
            {key === "website" && typeof val === "string" ? (
              <a href={val.startsWith("http") ? val : `https://${val}`} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                {val}
              </a>
            ) : typeof val === "number" ? (
              val.toLocaleString("vi-VN")
            ) : (
              String(val)
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>
      {profile.overview && (
        <div className="mt-4">
          <Title level={5} style={{ color: "#fff", margin: 0, marginBottom: 8 }}>
            Giới thiệu
          </Title>
          <p className="text-gray-300 text-sm leading-relaxed">{profile.overview}</p>
        </div>
      )}
    </Card>
  );
}
