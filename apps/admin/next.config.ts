import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats for better compression
    formats: ["image/avif", "image/webp"],

    // Remote image domains (add as needed)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],

    // Device breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Icon/thumbnail sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL in seconds (1 year for immutable assets)
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
