import type { NextConfig } from "next";

// Ensure a valid URL string without trailing slashes
const rawBackendUrl = process.env.BACKEND_URL || "https://ethiovuln-backend.onrender.com";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

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