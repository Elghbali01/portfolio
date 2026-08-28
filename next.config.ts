import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 76, 82, 85],
    minimumCacheTTL: 2_592_000,
  },
};

export default nextConfig;
