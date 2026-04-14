import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ElesWoodDesigns",
  description: "Get in touch with ElesWoodDesigns for any questions about our DIY woodworking plans.",
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2 leading-none">Contact Us</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Need help with a build? We're here for you.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FFE500] border-8 border-black p-12 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-8 tracking-tighter">Get In Touch</h2>
          <p className="text-xl font-bold mb-10 leading-relaxed">
            Have a question about a plan? Need technical support? <br/>
            Shoot us an email and we'll get back to you as soon as possible.
          </p>
          
          <div className="bg-white border-4 border-black p-8 inline-block transform -rotate-2 hover:rotate-0 transition-transform">
            <a 
              href="mailto:eleswooddesigns@gmail.com" 
              className="text-2xl md:text-4xl font-black underline hover:bg-black hover:text-white px-2 transition-colors break-all"
            >
              eleswooddesigns@gmail.com
            </a>
          </div>
          
          <p className="mt-12 font-bold text-sm uppercase tracking-widest text-black/60">
            We usually respond within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">Business Hours</h3>
            <div className="space-y-2 font-bold uppercase text-sm">
              <div className="flex justify-between border-b-2 border-black pb-2">
                <span>MON - FRI</span>
                <span>09:00 - 18:00</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>SAT - SUN</span>
                <span className="text-gray-500">OFF DUTY</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <p className="font-black text-xl italic text-center">
              "Quality plans. <br/>Direct support."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
