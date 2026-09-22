import type { NextConfig } from "next";

// Fallback value
const defaultBackend = "https://ethiovuln-backend.onrender.com";

// Ensure we get a clean origin string (e.g., https://ethiovuln-backend.onrender.com)
let targetBackend = defaultBackend;
try {
  const envUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl) {
    // If envUrl contains brackets or invalid formats, extract standard http(s) URL
    const cleanMatch = envUrl.match(/https?:\/\/[^\s"'\]]+/);
    if (cleanMatch) {
      targetBackend = new URL(cleanMatch[0]).origin;
    }
  }
} catch {
  targetBackend = defaultBackend;
}

const nextConfig: NextConfig = {
  output: "standalone",

  allowedDevOrigins: ['172.29.192.1', '192.168.56.1', '192.168.1.*', '10.*.*.*'],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${targetBackend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;