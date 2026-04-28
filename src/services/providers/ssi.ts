import { ssiMarketApi } from "../api-client";
import type { MarketIndex, TopStock } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

const SSI_HEADERS = {
  "X-Fiin-Key": "KEY",
  "X-Fiin-User-ID": "ID",
  "X-Fiin-Seed": "SEED",
  "Content-Type": "application/json",
};

interface SsiTopMoverItem {
  organCode: string;
  organShortName: string;
  ticker: string;
  closePriceAdjusted: number;
  priceChangePercent1M?: number;
  priceChangePercent1D?: number;
  pctChange?: number;
  totalMatchVolume?: number;
  totalMatchValue?: number;
  comGroupCode?: string;
}

async function fetchTopMover(
  type: "Gainers" | "Losers" | "Volume" | "Value"
): Promise<TopStock[]> {
  const { data } = await ssiMarketApi.get(`/TopMover/GetTop${type}`, {
    params: { language: "vi", ComGroupCode: "All" },
    headers: SSI_HEADERS,
  });

  const items: SsiTopMoverItem[] = data?.items || [];
  return items.slice(0, 10).map((item) => {
    const pctChange = item.priceChangePercent1D ?? item.pctChange ?? 0;
    const price = item.closePriceAdjusted || 0;
    const change = +((price * pctChange) / 100).toFixed(2);

    return {
      symbol: item.ticker || item.organCode,
      companyName: item.organShortName || item.ticker || "",
      price: +price.toFixed(2),
      change,
      changePercent: +pctChange.toFixed(2),
      volume: item.totalMatchVolume || 0,
    };
  });
}

export async function ssiFetchTopGainers(): Promise<TopStock[]> {
  return fetchTopMover("Gainers");
}

export async function ssiFetchTopLosers(): Promise<TopStock[]> {
  return fetchTopMover("Losers");
}

export async function ssiFetchTopVolume(): Promise<TopStock[]> {
  return fetchTopMover("Volume");
}

interface SsiIndexItem {
  indexId: string;
  indexValue: number;
  change: number;
  ratioChange: number;
  totalMatchVolume: number;
  tradingDate: string;
}

export async function ssiFetchMarketIndices(): Promise<MarketIndex[]> {
  try {
    const { data } = await ssiMarketApi.get(`/HeatMap/GetHeatMap`, {
      params: { language: "vi" },
      headers: SSI_HEADERS,
    });

    if (data?.items) {
      const indexMap: Record<string, { name: string }> = {
        VNINDEX: { name: "VN-Index" },
        HNXINDEX: { name: "HNX-Index" },
        UPCOMINDEX: { name: "UPCOM-Index" },
      };

      const items: SsiIndexItem[] = data.items;
      return items
        .filter((item: any) => indexMap[item.indexId])
        .map((item: any) => ({
          name: indexMap[item.indexId]?.name || item.indexId,
          value: item.indexValue || 0,
          change: item.change || 0,
          changePercent: item.ratioChange || 0,
          volume: item.totalMatchVolume || 0,
          updatedAt: item.tradingDate || new Date().toISOString(),
        }));
    }
  } catch {
    // SSI API might be behind Cloudflare, fall through
  }

  return ssiFetchMarketIndicesFallback();
}

async function ssiFetchMarketIndicesFallback(): Promise<MarketIndex[]> {
  const { tcbsApi } = await import("../api-client");

  const indices = [
    { ticker: "VNINDEX", name: "VN-Index" },
    { ticker: "HNXINDEX", name: "HNX-Index" },
    { ticker: "UPCOMINDEX", name: "UPCOM-Index" },
  ];

  const results = await Promise.allSettled(
    indices.map(async ({ ticker, name }) => {
      const to = Math.floor(Date.now() / 1000);
      const from = to - 5 * 24 * 60 * 60;

      const { data } = await tcbsApi.get(
        `/stock-insight/v1/stock/bars-long-term`,
        {
          params: {
            ticker,
            type: "index",
            resolution: "D",
            from,
            to,
          },
        }
      );

      const bars = data?.data || [];
      if (bars.length < 2) throw new Error(`No index data for ${ticker}`);

      const latest = bars[bars.length - 1];
      const prev = bars[bars.length - 2];
      const change = +(latest.close - prev.close).toFixed(2);
      const changePercent = +((change / prev.close) * 100).toFixed(2);

      return {
        name,
        value: latest.close,
        change,
        changePercent,
        volume: latest.volume,
        updatedAt: latest.tradingDate?.split("T")[0] || new Date().toISOString(),
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<MarketIndex> => r.status === "fulfilled")
    .map((r) => r.value);
}
