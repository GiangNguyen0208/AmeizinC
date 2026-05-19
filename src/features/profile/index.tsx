"use client";

import { Layout, Menu } from "antd";
import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import type { ProfileTab } from "@/types";
import { PersonalInfo } from "./components/PersonalInfo";
import { NotesManager } from "./components/NotesManager";
import { ChangePassword } from "./components/ChangePassword";
import { GuideMap } from "./components/GuideMap";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "info", icon: <UserOutlined />, label: "Thông tin" },
  { key: "guide", icon: <BookOutlined />, label: "Hướng dẫn" },
  { key: "notes", icon: <FileTextOutlined />, label: "Ghi chú" },
  { key: "password", icon: <LockOutlined />, label: "Đổi mật khẩu" },
];

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/login");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Layout className="min-h-[calc(100vh-200px)] rounded-lg overflow-hidden bg-transparent">
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="md"
          collapsedWidth={60}
          className="bg-gray-800/50!"
          theme="dark"
        >
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems}
            onClick={({ key }) => setActiveTab(key as ProfileTab)}
            className="bg-transparent! border-none! mt-2"
            theme="dark"
          />
        </Sider>
        <Content className="p-6">
          {activeTab === "info" && <PersonalInfo />}
          {activeTab === "guide" && <GuideMap />}
          {activeTab === "notes" && <NotesManager />}
          {activeTab === "password" && <ChangePassword />}
        </Content>
      </Layout>
    </div>
  );
}
