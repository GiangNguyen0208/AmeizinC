"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFinanceData, fetchCompanyProfile } from "@/services";

export function useFinanceData(symbol: string) {
  return useQuery({
    queryKey: ["finance-data", symbol],
    queryFn: () => fetchFinanceData(symbol),
    enabled: !!symbol,
  });
}

export function useCompanyProfile(symbol: string) {
  return useQuery({
    queryKey: ["company-profile", symbol],
    queryFn: () => fetchCompanyProfile(symbol),
    enabled: !!symbol,
  });
}
