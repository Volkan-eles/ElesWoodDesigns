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
      {
        source: "/products/kids-mud-kitchen-plans-wooden-outdoor-play-station-blueprint-pdf-download/",
        destination: "/products/diy-mud-kitchen-plans-wide-montessori-inspired-kids-outdoor-kitchen-building/",
        permanent: true,
      },
      {
        source: "/products/kids-mud-kitchen-plans-diy-wooden-outdoor-play-station-blueprint-pdf-download/",
        destination: "/products/diy-kids-mud-kitchen-plans-montessori-outdoor-play-station-pdf-download/",
        permanent: true,
      },
      {
        source: "/products/mud-kitchen-plans-pdf-wide-outdoor-play-kitchen-blueprint-for-kids-diy-sink-stove-build/",
        destination: "/products/diy-wooden-mud-kitchen-building-plans-outdoor-play-station-with-sink-pdf/",
        permanent: true,
      },
      {
        source: "/products/easy-diy-mud-kitchen-plans-beginner-wooden-outdoor-play-blueprint-pdf-download/",
        destination: "/products/diy-wooden-mud-kitchen-plans-outdoor-play-kitchen-blueprint-digital-download/",
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
