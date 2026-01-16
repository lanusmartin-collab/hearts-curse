import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: true,
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
