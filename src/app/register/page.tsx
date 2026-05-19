"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card, Result, Alert } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth";
import { ApiError } from "@/services/api-client";

const { Title, Text } = Typography;

interface RegisterError {
  type: "warning" | "error";
  message: string;
  description?: string;
}

function getRegisterError(err: unknown): RegisterError {
  if (err instanceof ApiError) {
    if (err.status === 409) {
      return {
        type: "warning",
        message: "Email đã được đăng ký",
        description: "Tài khoản với email này đã tồn tại. Vui lòng đăng nhập hoặc sử dụng email khác.",
      };
    }
    if (err.status === 400) {
      const errors = (err.data as { errors?: string[] })?.errors;
      return {
        type: "error",
        message: "Thông tin không hợp lệ",
        description: errors?.join(". ") || err.message,
      };
    }
    if (err.status >= 500) {
      return {
        type: "error",
        message: "Lỗi hệ thống",
        description: "Máy chủ gặp sự cố, vui lòng thử lại sau.",
      };
    }
    return {
      type: "error",
      message: "Đăng ký thất bại",
      description: err.message,
    };
  }
  return {
    type: "error",
    message: "Không thể kết nối đến máy chủ",
    description: "Vui lòng kiểm tra kết nối mạng và thử lại.",
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState<RegisterError | null>(null);

  const onFinish = async (values: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await register(values);
      setRegisteredEmail(values.email);
      setRegistered(true);
    } catch (err) {
      setError(getRegisterError(err));
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
          <Result
            status="success"
            title="Đăng ký thành công!"
            subTitle={`Chúng tôi đã gửi email xác nhận đến ${registeredEmail}. Vui lòng kiểm tra hộp thư và click link xác nhận để kích hoạt tài khoản.`}
            extra={
              <Button type="primary" onClick={() => router.push("/")}>
                Về trang chủ
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
        <Title level={3} className="text-center mb-6!">
          Đăng ký tài khoản
        </Title>

        {error && (
          <Alert
            type={error.type}
            message={error.message}
            description={
              <>
                {error.description}
                {error.type === "warning" && (
                  <>
                    {" "}
                    <Link
                      href="/login"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Đăng nhập ngay
                    </Link>
                  </>
                )}
              </>
            }
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item className="mb-0!">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Text className="block text-center text-gray-400 mt-4">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Đăng nhập
          </Link>
        </Text>
      </Card>
    </div>
  );
}
