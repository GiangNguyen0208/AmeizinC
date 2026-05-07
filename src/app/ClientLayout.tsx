"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, App as AntApp, theme } from "antd";
import { useState, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const antTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#3b82f6",
    colorBgContainer: "#111827",
    colorBgElevated: "#1f2937",
    colorBorder: "#374151",
    borderRadius: 8,
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
};

export function ClientLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchInterval: 60 * 1000,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ConfigProvider theme={antTheme}>
          <AntApp>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </AntApp>
        </ConfigProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
