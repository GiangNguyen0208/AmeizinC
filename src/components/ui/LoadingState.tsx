"use client";

import { Spin } from "antd";

export function LoadingState({ tip = "Đang tải..." }: { tip?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <Spin size="large" tip={tip}>
        <div className="p-12" />
      </Spin>
    </div>
  );
}
