import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "dummyjson.com" },
      { protocol: "https", hostname: "robohash.org" },
    ],
  },
};

export default nextConfig;
