import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/feed.xml',
        destination: '/feed/',
        permanent: true,
      },
      {
        source: '/feed.xml/',
        destination: '/feed/',
        permanent: true,
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
