import type { NextConfig } from "next";

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

export default nextConfig;
