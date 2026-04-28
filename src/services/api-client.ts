import axios from "axios";

export const fiintradeApi = axios.create({
  baseURL: "https://fiin-core.ssi.com.vn/Master",
  headers: {
    "Content-Type": "application/json",
  },
});

export const simplizeApi = axios.create({
  baseURL: "https://simplize.vn/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const vpsApi = axios.create({
  baseURL: "https://bgapidatafeed.vps.com.vn",
  headers: {
    "Content-Type": "application/json",
  },
});
