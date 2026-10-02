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
      // October 2, 2026 CSV Revisions Redirects
      {
        source: "/products/diy-collapsible-charcuterie-cart-plans-mobile-bar-cart-pdf/",
        destination: "/products/diy-collapsible-coffee-cart-plans-mobile-food-bar-blueprint-pdf-download/",
        permanent: true,
      },
      {
        source: "/products/outdoor-kitchen-plans-covered-bbq-grill-station-build-pdf-download/",
        destination: "/products/diy-covered-outdoor-kitchen-plans-wood-bbq-grill-station-blueprint-pdf-download/",
        permanent: true,
      },
      {
        source: "/products/modern-platform-bed-frame-plan-wood-bed-diy-pattern-with-nightstands-pdf-download/",
        destination: "/products/modern-queen-platform-bed-plans-diy-wood-frame-with-nightstands-pdf/",
        permanent: true,
      },
      {
        source: "/products/diy-lean-to-greenhouse-plans-wood-patio-garden-glasshouse-blueprint-pdf-download/",
        destination: "/products/diy-lean-to-greenhouse-plans-wooden-attached-greenhouse-blueprint-pdf-download/",
        permanent: true,
      },
      {
        source: "/products/diy-full-size-loft-bed-plans-built-in-stair-shelves-storage-woodworking-blueprint-pdf/",
        destination: "/products/full-size-loft-bed-plans-diy-woodworking-blueprint-with-stairs-and-storage-pdf/",
        permanent: true,
      },
      {
        source: "/products/10x24-gazebo-build-plans-diy-backyard-pergola-pavilion-guide-pdf-download/",
        destination: "/products/10x24-backyard-gazebo-plans-pdf-diy-wood-pavilion-blueprint-digital-download/",
        permanent: true,
      },
      {
        source: "/products/heavy-duty-workbench-plans-shelves-pegboard-mobile-craft-table-pdf-download/",
        destination: "/products/diy-garage-workbench-plans-heavy-duty-pegboard-mobile-option-pdf-download/",
        permanent: true,
      },
      {
        source: "/products/triple-wheelie-bin-storage-plans-wooden-trash-can-enclosure-blueprint-pdf-download/",
        destination: "/products/diy-triple-wheelie-bin-storage-plans-wooden-trash-can-enclosure-blueprint-pdf/",
        permanent: true,
      },
      {
        source: "/products/treehouse-plans-pdf-diy-tree-house-plans-kids-playhouse-plans-tree-fort-plans-backyard-treehouse-step-by-step-woodworkin/",
        destination: "/products/diy-treehouse-plans-pdf-backyard-kids-tree-fort-and-playhouse-blueprint-wooden/",
        permanent: true,
      },
      {
        source: "/products/circular-pergola-porch-swing-plans-freestanding-wood-canopy-arbor-blueprint-pdf/",
        destination: "/products/circular-pergola-swing-plans-diy-porch-swing-with-canopy-pdf-blueprint/",
        permanent: true,
      },
      // Historical Slug Redirects
      {
        source: "/products/diy-farmstand-plans-roadside-produce-flower-and-bakery-stand-pdf-download/",
        destination: "/products/diy-farmstand-plans-pdf-wheelable-flower-cart-and-bakery-stand-blueprint-digital/",
        permanent: true,
      },
      {
        source: "/products/diy-farmstand-plans-pdf-portable-roadside-stand-for-produce-eggs-flowers-bakery-cart/",
        destination: "/products/diy-farm-stand-plans-portable-produce-cart-bakery-display-woodworking-pdf-downlo/",
        permanent: true,
      },
      {
        source: "/products/diy-rainwater-collection-system-plans-pdf-ibc-tote-enclosure-blueprint-rain-barrel-shed-wood-water-storage-stand/",
        destination: "/products/diy-farm-stand-plans-pdf-wooden-produce-stand-plans-roadside-market-stand-flower-bakery-display-digital-download/",
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
