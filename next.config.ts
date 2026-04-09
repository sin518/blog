import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "mockmind-api.uifaces.co",
      },
      { hostname: "picsum.photos" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
  // 确保 Prisma 引擎在 Vercel 上正确工作
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
