import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the homepage preview became the homepage on 2026-11-19
  async redirects() {
    return [{ source: '/home-preview', destination: '/', permanent: true }]
  },
};

export default nextConfig;
