'use client';

import React from 'react';
import { Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinterestSaveButtonProps {
  url: string;
  media: string;
  description: string;
  className?: string;
  variant?: 'small' | 'large';
}

export default function PinterestSaveButton({
  url,
  media,
  description,
  className,
  variant = 'small'
}: PinterestSaveButtonProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`;
    window.open(pinUrl, 'Pinterest', 'width=800,height=600');
  };

  return (
    <button
      onClick={handleSave}
      title="Save to Pinterest"
      className={cn(
        "flex items-center justify-center gap-2 font-black transition-all border-2 border-black",
        variant === 'large' 
          ? "bg-[#E60023] text-white px-6 py-3 text-lg shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px]" 
          : "bg-[#E60023] text-white p-2 rounded-full shadow-neo-sm hover:scale-110",
        className
      )}
    >
      <Pin className={cn(variant === 'large' ? "w-6 h-6" : "w-5 h-5")} />
      {variant === 'large' && <span>SAVE TO PINTEREST</span>}
    </button>
  );
}
