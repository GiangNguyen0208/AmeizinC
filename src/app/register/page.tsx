"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card, App, Tabs } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  register,
  sendSmsOtp,
  registerWithSms,
  authenticateWithGoogle,
} from "@/services/auth";
import { ApiError } from "@/services/api-client";

const { Title, Text } = Typography;

function EmailRegisterForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    setLoading(true);
    try {
      await register(values);
      message.success("Đăng ký thành công!");
      router.push("/");
    } catch (err) {
      message.error(
        err instanceof ApiError ? err.message : "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
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
      <Form.Item className="!mb-0">
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
  );
}

function SmsRegisterForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.match(/^[0-9]{9,15}$/)) {
      message.warning("Số điện thoại không hợp lệ");
      return;
    }
    setSendingOtp(true);
    try {
      await sendSmsOtp(phone);
      setOtpSent(true);
      message.success("Đã gửi mã OTP!");
    } catch (err) {
      message.error(
        err instanceof ApiError ? err.message : "Gửi OTP thất bại"
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const onFinish = async (values: { otp: string; fullName: string }) => {
    setLoading(true);
    try {
      await registerWithSms({ phone, otp: values.otp, fullName: values.fullName });
      message.success("Đăng ký thành công!");
      router.push("/");
    } catch (err) {
      message.error(
        err instanceof ApiError ? err.message : "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item>
        <div className="flex gap-2">
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Số điện thoại"
            size="large"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpSent}
          />
          <Button
            size="large"
            onClick={handleSendOtp}
            loading={sendingOtp}
            disabled={otpSent}
          >
            Gửi OTP
          </Button>
        </div>
      </Form.Item>
      {otpSent && (
        <>
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
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
          >
            <Input
              placeholder="Nhập mã OTP (6 số)"
              size="large"
              maxLength={6}
            />
          </Form.Item>
          <Form.Item className="!mb-0">
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
        </>
      )}
    </Form>
  );
}

function GoogleRegisterForm() {
  const router = useRouter();
  const { message } = App.useApp();

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <div className="text-center py-4">
        <GoogleOutlined className="text-2xl text-gray-500 mb-2" />
        <Text className="block text-gray-400">
          Google Sign-In chưa được cấu hình
        </Text>
        <Text className="block text-gray-500 text-xs mt-1">
          Thêm NEXT_PUBLIC_GOOGLE_CLIENT_ID vào .env.local
        </Text>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-2">
      <GoogleLogin
        onSuccess={async (response) => {
          if (!response.credential) return;
          try {
            await authenticateWithGoogle({ idToken: response.credential });
            message.success("Đăng ký thành công!");
            router.push("/");
          } catch (err) {
            message.error(
              err instanceof ApiError ? err.message : "Đăng ký thất bại"
            );
          }
        }}
        onError={() => message.error("Đăng ký Google thất bại")}
        theme="filled_black"
        size="large"
        width="320"
      />
    </div>
  );
}

export default function RegisterPage() {
  const items = [
    { key: "email", label: "Email", children: <EmailRegisterForm /> },
    { key: "sms", label: "SMS", children: <SmsRegisterForm /> },
    { key: "google", label: "Google", children: <GoogleRegisterForm /> },
  ];

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md" styles={{ body: { padding: 32 } }}>
        <Title level={3} className="text-center !mb-4">
          Đăng ký tài khoản
        </Title>

        <Tabs items={items} centered />

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
