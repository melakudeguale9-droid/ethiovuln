import type { NextConfig } from "next";

// Used by the API proxy rewrite (server-side at runtime, not baked in at build)
const BACKEND_URL = process.env.BACKEND_URL || "https://ethiovuln-backend.onrender.com";

const nextConfig: NextConfig = {
  // Always enable standalone output for Docker deployments
  output: "standalone",

  allowedDevOrigins: ['172.29.192.1', '192.168.56.1', '192.168.1.*', '10.*.*.*'],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;