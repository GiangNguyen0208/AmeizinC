import axios from "axios";

export const fiintradeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FIINTRADE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const simplizeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SIMPLIZE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vpsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VPS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const isMockEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "true";
