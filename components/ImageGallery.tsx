"use client";

import { useState } from "react";
import Image from "next/image";
import PinterestSaveButton from "./PinterestSaveButton";

interface ImageGalleryProps {
  images: string[];
  thumbnails: string[];
  alt: string;
  productName: string;
  productUrl: string;
  productSlug: string;
}

export default function ImageGallery({ 
  images, 
  thumbnails, 
  alt,
  productName,
  productUrl,
  productSlug,
}: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Use the fast pre-generated static portrait-format pin image (serves in 20ms from CDN)
  const pinImageUrl = `https://eleswooddesigns.com/pinterest-images/${productSlug}.jpg`;
  const pinDescription = `${productName} — DIY Woodworking Plans PDF | Step-by-step blueprint with cut list & 3D diagrams | Instant Download by ElesWoodDesigns`;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="card-neo overflow-hidden bg-white relative group">
        <div className="relative aspect-square">
          <Image
            src={images[activeIdx]}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-300"
            priority
          />
          
          {/* Pinterest Save — always visible on mobile, hover on desktop */}
          <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <PinterestSaveButton 
              url={productUrl}
              media={pinImageUrl}
              description={pinDescription}
              variant="small"
            />
          </div>
        </div>
      </div>

      {/* Prominent Pinterest Save Button below image */}
      <PinterestSaveButton
        url={productUrl}
        media={pinImageUrl}
        description={pinDescription}
        variant="large"
        className="w-full"
      />

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-4">
        {thumbnails.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            onMouseEnter={() => setActiveIdx(idx)}
            className={`
              relative aspect-square border-2 border-black overflow-hidden
              transition-all duration-200
              ${activeIdx === idx 
                ? 'ring-4 ring-[#FFE500] -translate-y-1 shadow-neo-sm' 
                : 'opacity-70 hover:opacity-100 hover:-translate-y-1'
              }
            `}
          >
            <Image
              src={thumb}
              alt={`${alt} thumbnail ${idx + 1}`}
              fill
              sizes="100px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
