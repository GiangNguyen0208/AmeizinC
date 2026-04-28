"use client";

import { Result, Button } from "antd";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Có lỗi xảy ra", onRetry }: ErrorStateProps) {
  return (
    <Result
      status="error"
      title="Lỗi"
      subTitle={message}
      extra={
        onRetry && (
          <Button type="primary" onClick={onRetry}>
            Thử lại
          </Button>
        )
      }
    />
  );
}
