"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMarketIndices,
  fetchTopGainers,
  fetchTopLosers,
  fetchTopVolume,
} from "@/services";

export function useMarketIndices() {
  return useQuery({
    queryKey: ["market-indices"],
    queryFn: fetchMarketIndices,
  });
}

export function useTopGainers() {
  return useQuery({
    queryKey: ["top-gainers"],
    queryFn: fetchTopGainers,
  });
}

export function useTopLosers() {
  return useQuery({
    queryKey: ["top-losers"],
    queryFn: fetchTopLosers,
  });
}

export function useTopVolume() {
  return useQuery({
    queryKey: ["top-volume"],
    queryFn: fetchTopVolume,
  });
}
