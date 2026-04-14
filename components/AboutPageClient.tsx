"use client";

import { Hammer, Users, ShieldCheck, HeartPulse, Send } from "lucide-react";

export default function AboutPageClient() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">About Us</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Crafting the blueprints for your next masterpiece.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="bg-white border-4 border-black p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-bold leading-tight mb-6">
            We don't just sell woodworking plans; we offer you the opportunity to create your own furniture, 
            excitement, and that warmth in your home with your own hands.
          </p>
          <p className="font-bold text-gray-700 mb-8">
            Our journey on Etsy began with a passion to make carpentry accessible to everyone. 
            Today, we take pride in offering error-free and professional projects to thousands of happy makers.
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="bg-[#FFE500] border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               3,000+ Customers
             </div>
             <div className="bg-white border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               5 Star Etsy Rating
             </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-[#FF5C00] border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-12">
            <Hammer size={200} className="text-white transform -rotate-12" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <div className="bg-[#FF5C00] p-4 border-4 border-black inline-block mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Users size={32} color="white" />
          </div>
          <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">Community Driven</h3>
          <p className="font-bold text-gray-600">We take your feedback into account when creating our plans and prioritize the projects that are most needed.</p>
        </div>

        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <div className="bg-[#22C55E] p-4 border-4 border-black inline-block mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck size={32} color="white" />
          </div>
          <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">Zero Error Margin</h3>
          <p className="font-bold text-gray-600">All our measurements are checked with millimetric precision. Not a single screw is left out of our parts lists.</p>
        </div>

        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <div className="bg-[#FFE500] p-4 border-4 border-black inline-block mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <HeartPulse size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">Designed with Passion</h3>
          <p className="font-bold text-gray-600">Every plan is not just a drawing, but a guide that will make you experience the satisfaction of a finished project.</p>
        </div>
      </div>

      <div className="bg-black text-white p-12 text-center border-4 border-black shadow-[20px_20px_0px_0px_rgba(255,229,0,1)]">
        <h2 className="text-4xl font-black uppercase mb-6 tracking-tighter">Have a Question?</h2>
        <p className="mb-8 font-bold text-gray-400">You can contact us for any technical support regarding our projects.</p>
        <a href="mailto:eleswooddesigns@gmail.com" className="inline-block bg-[#FFE500] text-black px-10 py-5 font-black uppercase tracking-widest hover:scale-105 transition-transform border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
          Send Us a Message
        </a>
      </div>
    </div>
  );
}
