"use client";

import { useSearchParams } from "next/navigation";
import { Card, Result, Button, Spin } from "antd";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail, fetchProfile } from "@/services/auth";
import { ApiError } from "@/services/api-client";
import { useAuthStore } from "@/stores/auth-store";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { isPending, isSuccess, error } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      if (!token) throw new Error("Thiếu token xác nhận");
      await verifyEmail(token);
      if (useAuthStore.getState().user) {
        await fetchProfile();
      }
      return true;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const errorMsg =
    error instanceof ApiError
      ? error.message
      : error?.message || "Xác nhận email thất bại";

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
        {isPending && (
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="mt-4 text-gray-400">Đang xác nhận email...</p>
          </div>
        )}
        {isSuccess && (
          <Result
            status="success"
            title="Xác nhận email thành công!"
            subTitle="Tài khoản của bạn đã được kích hoạt."
            extra={
              <Link href="/">
                <Button type="primary" size="large">
                  Về trang chủ
                </Button>
              </Link>
            }
          />
        )}
        {error && (
          <Result
            status="error"
            title="Xác nhận email thất bại"
            subTitle={errorMsg}
            extra={
              <Link href="/">
                <Button type="primary" size="large">
                  Về trang chủ
                </Button>
              </Link>
            }
          />
        )}
      </Card>
    </div>
  );
}
