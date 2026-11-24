import type { NextConfig } from "next";

// Backend origin (NEXT_PUBLIC_API_URL minus the `/api` suffix), used to proxy `/uploads/*`.
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  // App Router standalone traces can omit legacy pages/*; hosts still require _error at runtime.
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/next/dist/pages/_error.js",
      "./node_modules/next/dist/pages/_document.js",
      "./node_modules/next/dist/pages/_app.js",
    ],
  },
  // Dev only: prints server-side fetches (Server Components) in the `next dev` terminal with their
  // full URL, since they never appear in the browser's Network tab.
  logging: { fetches: { fullUrl: true } },
  // Rich text (blog) stores relative `/uploads/...` image links. Proxying them to the backend makes
  // those links work on whatever host the site runs on, in the editor and on public pages.
  async rewrites() {
    if (!API_ORIGIN) return [];
    return [{ source: "/uploads/:path*", destination: `${API_ORIGIN}/uploads/:path*` }];
  },
  // Dev only: lets a phone or another PC on the LAN open http://192.168.1.12:3002 without
  // Next blocking its HMR websocket. Ignored in production builds.
  allowedDevOrigins: ["192.168.1.12"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "backend.chefdclub.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "apichefdclub.uatprojects.in",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "chefdclub-backend.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i3.ytimg.com",
        pathname: "/vi/**",
      },
    ],
    // The dev backend runs on localhost — Next's SSRF guard blocks loopback
    // hostnames by default. Production points at a real domain, not localhost,
    // so this only ever applies locally.
    ...(process.env.NODE_ENV === "development" ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
