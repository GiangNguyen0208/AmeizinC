"use client";

import { Tag, Tooltip } from "antd";
import { SyncOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchMeta } from "@/services";

function isTradingHours(): boolean {
  const now = new Date();
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const utcDay = now.getUTCDay();

  let vnH = utcH + 7;
  let vnDay = utcDay;
  if (vnH >= 24) {
    vnH -= 24;
    vnDay = (vnDay + 1) % 7;
  }
  if (vnDay === 0 || vnDay === 6) return false;

  const vnMinutes = vnH * 60 + utcM;
  return (vnMinutes >= 540 && vnMinutes <= 690) || (vnMinutes >= 780 && vnMinutes <= 900);
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

export function DataFreshness() {
  const { data: meta } = useQuery({
    queryKey: ["crawl-meta"],
    queryFn: fetchMeta,
  });

  if (!meta) return null;

  const trading = isTradingHours();
  const relTime = formatRelativeTime(meta.crawledAt);

  return (
    <Tooltip title={`Nguồn: ${meta.source} | ${meta.trackedSymbols.length} mã theo dõi`}>
      <Tag
        icon={trading ? <SyncOutlined spin /> : <CheckCircleOutlined />}
        color={trading ? "processing" : "default"}
      >
        {trading ? "Đang giao dịch" : "Ngoài giờ GD"} &mdash; Cập nhật {relTime}
      </Tag>
    </Tooltip>
  );
}
