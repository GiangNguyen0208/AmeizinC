import { existsSync } from "fs";
import { resolve } from "path";
import type { NextConfig } from "next";

const hasData = existsSync(resolve(process.cwd(), "public/data/_meta.json"));
const mockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "true";

if (!hasData && !mockEnabled) {
  console.error(
    [
      "",
      "  Ameizin — Setup Required",
      "  ========================",
      "",
      "  No market data found in public/data/.",
      "  Please complete one of these steps:",
      "",
      "  1. Run the crawler:",
      "     cp .env.example .env.local",
      "     # Add your VNSTOCK_API_KEY in .env.local",
      "     npm run crawl",
      "",
      "  2. Or enable mock data for development:",
      "     Set NEXT_PUBLIC_ENABLE_MOCK_DATA=true in .env.local",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath:
    process.env.NEXT_PUBLIC_BASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/AmeizinC" : ""),
};

export default nextConfig;
