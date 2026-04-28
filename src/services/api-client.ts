import axios from "axios";

const proxyUrl = process.env.NEXT_PUBLIC_CORS_PROXY_URL || "";

function withProxy(baseURL: string): string {
  if (!proxyUrl) return baseURL;
  return `${proxyUrl}/${baseURL.replace(/^https?:\/\//, "")}`;
}

export const tcbsApi = axios.create({
  baseURL: withProxy(
    process.env.NEXT_PUBLIC_TCBS_API_URL ||
      "https://apipubaws.tcbs.com.vn"
  ),
  headers: { "Content-Type": "application/json" },
});

export const ssiMarketApi = axios.create({
  baseURL: withProxy(
    process.env.NEXT_PUBLIC_SSI_MARKET_API_URL ||
      "https://fiin-market.ssi.com.vn"
  ),
  headers: { "Content-Type": "application/json" },
});

export const isMockEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "true";
