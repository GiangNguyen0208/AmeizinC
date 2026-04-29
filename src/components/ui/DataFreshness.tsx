"use client";

import { Tag, Tooltip } from "antd";
import { SyncOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchMeta } from "@/services";
import { isTradingHours, formatRelativeTime } from "@/utils/format";

export function DataFreshness() {
  const { data: meta } = useQuery({
    queryKey: ["crawl-meta"],
    queryFn: fetchMeta,
  });

  if (!meta) {
    return null;
  }

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