import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath:
    process.env.NEXT_PUBLIC_BASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/ameizin" : ""),
};

export default nextConfig;
