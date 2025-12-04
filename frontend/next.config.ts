import type { NextConfig } from "next";

const backendPort = process.env.BACKEND_PORT || process.env.PORT || '3000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${backendPort}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
