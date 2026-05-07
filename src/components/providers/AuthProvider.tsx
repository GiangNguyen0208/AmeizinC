"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { fetchProfile } from "@/services/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!accessToken) {
      setInitialized();
      return;
    }

    fetchProfile()
      .catch(() => {
        logout();
      })
      .finally(() => {
        setInitialized();
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
