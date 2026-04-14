import React from 'react';
import { Star, Quote } from 'lucide-react';
import reviewsData from '@/data/reviews.json';

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-20 border-b-4 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-col items-center text-center">
          <Quote className="w-12 h-12 mb-4 text-[#FFE500]" />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Verified Etsy Reviews</h2>
          <div className="flex items-center gap-2 mt-4 bg-gray-100 border-2 border-black px-4 py-2">
             <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FFE500] text-black" />
                ))}
             </div>
             <span className="font-bold text-sm uppercase">5.0 Shop Rating</span>
          </div>
        </div>
      </div>

      {/* Horizontal scrolling container for desktop & mobile */}
      <div className="pb-8 px-4 flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* We use a spacer to align the first item nicely on wide screens, but for simplicity, we'll just justify start */}
        <div className="flex gap-6 w-max mx-auto px-4 lg:px-8">
          {reviewsData.map((review) => (
            <div 
              key={review.id} 
              className="card-neo bg-white w-[300px] sm:w-[350px] p-6 flex flex-col justify-between shrink-0 snap-center"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FFE500] text-black" />
                      ))}
                   </div>
                   <span className="text-xs font-bold text-gray-400">{review.date}</span>
                </div>
                <p className="font-bold text-lg leading-snug mb-6">"{review.review}"</p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t-2 border-black border-dashed">
                <div className="w-10 h-10 bg-[#FFE500] border-2 border-black flex items-center justify-center font-black text-xl shrink-0">
                  {review.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase leading-none">{review.name}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase mt-1">Purchased: {review.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}
