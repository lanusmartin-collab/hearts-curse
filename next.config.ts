import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: true, // Disabled due to path error with "Heart's Curse"
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "./",
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.aidedd.org',
        pathname: '/dnd/images/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
