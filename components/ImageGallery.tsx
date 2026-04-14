"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  thumbnails: string[];
  alt: string;
}

export default function ImageGallery({ images, thumbnails, alt }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="card-neo overflow-hidden bg-white">
        <div className="relative aspect-square">
          <Image
            src={images[activeIdx]}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-300"
            priority
          />
        </div>
      </div>

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
