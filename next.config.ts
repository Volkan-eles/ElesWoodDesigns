import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/feed.xml/',
        destination: '/product-feed-xml/',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
