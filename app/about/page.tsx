"use client";

import { Hammer, Users, ShieldCheck, HeartPulse, Send } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | ElesWoodDesigns",
  description: "Learn more about ElesWoodDesigns and our passion for woodworking.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen pt-24 pb-20">
      <div className="container">
        <div className="card bg-white p-12 mb-12 animate-fade">
          <div className="max-w-3xl">
            <h1 className="text-5xl mb-8">About Us</h1>
            <p className="text-xl leading-relaxed mb-6">
              We don't just sell woodworking plans; we offer you the opportunity to create your own furniture, 
              excitement, and that warmth in your home with your own hands.
            </p>
            <p className="text-lg text-gray mb-10">
              Our journey on Etsy began with a passion to make carpentry accessible to everyone. 
              Today, we take pride in offering error-free and professional projects to thousands of happy aspiring carpenters.
            </p>
            <div className="flex gap-4">
               <div className="badge badge-orange py-2 px-4">3,000+ Customers</div>
               <div className="badge badge-yellow py-2 px-4">5 Star Etsy Rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-white p-8 hover-lift">
            <div className="bg-orange p-4 border-2 border-black inline-block mb-6 shadow-[4px_4px_0_#000]">
              <Users size={32} color="white" />
            </div>
            <h3 className="text-2xl mb-4">Community Driven</h3>
            <p className="text-gray">We take your feedback into account when creating our plans and prioritize the projects that are most needed.</p>
          </div>

          <div className="card bg-white p-8 hover-lift">
            <div className="bg-green p-4 border-2 border-black inline-block mb-6 shadow-[4px_4px_0_#000]">
              <ShieldCheck size={32} color="white" />
            </div>
            <h3 className="text-2xl mb-4">Zero Error Margin</h3>
            <p className="text-gray">All our measurements are checked with millimetric precision. Not a single screw is left out of our parts lists.</p>
          </div>

          <div className="card bg-white p-8 hover-lift">
            <div className="bg-yellow p-4 border-2 border-black inline-block mb-6 shadow-[4px_4px_0_#000]">
              <HeartPulse size={32} />
            </div>
            <h3 className="text-2xl mb-4">Designed with Passion</h3>
            <p className="text-gray">Every plan is not just a drawing, but a guide that will make you experience the smell of that wood and the satisfaction of the finished state.</p>
          </div>
        </div>

        <div className="card bg-black text-white p-12 mt-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl mb-6">Have a Question?</h2>
            <p className="mb-8 text-gray-200">You can contact us for any technical support regarding our projects.</p>
            <a href="mailto:support@eleswooddesigns.com" className="btn-neo text-xl w-full sm:w-auto">
              <Send size={20} />
              Send Us a Message
            </a>
          </div>
          <Hammer size={200} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
        </div>
      </div>

      <style jsx>{`
        .flex { display: flex; }
        .grid { display: grid; }
        .gap-4 { gap: 16px; }
        .gap-8 { gap: 32px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .mb-10 { margin-bottom: 40px; }
        .mb-12 { margin-bottom: 48px; }
        .mt-12 { margin-top: 48px; }
        .p-4 { padding: 16px; }
        .p-8 { padding: 32px; }
        .p-12 { padding: 48px; }
        .px-4 { padding-left: 16px; padding-right: 16px; }
        .py-2 { padding-top: 8px; padding-bottom: 8px; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-4xl { font-size: 2.25rem; }
        .text-5xl { font-size: 3rem; }
        .leading-relaxed { line-height: 1.625; }
        .max-w-3xl { max-width: 48rem; }
        .text-center { text-align: center; }
        .relative { position: relative; }
        .z-10 { z-index: 10; }
        .absolute { position: absolute; }
        .-bottom-10 { bottom: -2.5rem; }
        .-right-10 { right: -2.5rem; }
        .rotate-12 { transform: rotate(12deg); }
        .opacity-10 { opacity: 0.1; }
        .inline-block { display: inline-block; }
        
        @media (min-width: 768px) {
          .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
}
