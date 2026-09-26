import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/products/diy-firewood-shed-plans-pdf-lean-to-log-storage-blueprint-outdoor-wood-rack/",
        destination: "/products/firewood-shed-plans-pdf-modern-slatted-woodshed-2-cord-capacity-diy-backyard-wood-storage-blueprint/",
        permanent: true,
      },
      {
        source: "/products/diy-firewood-shed-plans-lean-to-log-storage-blueprint-pdf-download/",
        destination: "/products/firewood-shed-plans-pdf-modern-slatted-woodshed-2-cord-capacity-diy-backyard-wood-storage-blueprint/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|css|js|woff2?)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
