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

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <form className="space-y-6">
            <div>
              <label className="block font-black uppercase tracking-widest text-xs mb-2">Your Name</label>
              <input 
                type="text" 
                className="w-full border-4 border-black p-4 font-bold text-lg focus:outline-none focus:bg-[#FFE500] transition-colors"
                placeholder="JOHN DOE"
              />
            </div>
            <div>
              <label className="block font-black uppercase tracking-widest text-xs mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full border-4 border-black p-4 font-bold text-lg focus:outline-none focus:bg-[#FFE500] transition-colors"
                placeholder="HELLO@EXAMPLE.COM"
              />
            </div>
            <div>
              <label className="block font-black uppercase tracking-widest text-xs mb-2">Message</label>
              <textarea 
                rows={5}
                className="w-full border-4 border-black p-4 font-bold text-lg focus:outline-none focus:bg-[#FFE500] transition-colors"
                placeholder="HOW CAN WE HELP?"
              ></textarea>
            </div>
            <button className="w-full bg-black text-white p-6 font-black uppercase tracking-widest text-xl hover:bg-[#FFE500] hover:text-black transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[8px_8px_0px_0px_rgba(255,229,0,0.3)]">
              Send Message
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div className="bg-[#FFE500] border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter">Direct Help</h2>
            <p className="font-bold mb-4">Have a quick question? Email us directly at:</p>
            <a href="mailto:support@eleswooddesigns.com" className="text-xl font-black underline hover:bg-black hover:text-white px-2 transition-colors">
              support@eleswooddesigns.com
            </a>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter">Business Hours</h2>
            <div className="space-y-2 font-bold">
              <div className="flex justify-between border-b-2 border-black pb-2">
                <span>MONDAY - FRIDAY</span>
                <span>09:00 - 18:00</span>
              </div>
              <div className="flex justify-between border-b-2 border-black pb-2 pt-2">
                <span>SATURDAY</span>
                <span>10:00 - 14:00</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>SUNDAY</span>
                <span className="text-gray-500">OFF DUTY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
