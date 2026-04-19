import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | ElesWoodDesigns",
  description: "Find answers to common questions about our woodworking plans, difficulty levels, and tool requirements.",
  alternates: {
    canonical: "https://eleswooddesigns.com/faq/",
  },
};

const faqs = [
  {
    q: "WHAT TOOLS DO I NEED?",
    a: "Most of our plans are designed for a standard home workshop. This typically include a circular saw or miter saw, a drill, a sander, and basic measuring tools. Each plan includes a specific tool list."
  },
  {
    q: "ARE THE PLANS BEGINNER-FRIENDLY?",
    a: "YES. We categorize our plans as Easy, Medium, or Hard. Many are perfect for beginners and include step-by-step instructions and 3D diagrams to guide you."
  },
  {
    q: "HOW DO I RECEIVE THE PLANS?",
    a: "All plans are instant digital downloads. Once your payment is processed, you will receive a link to download the PDF files immediately."
  },
  {
    q: "WHAT IF I GET STUCK DURING A BUILD?",
    a: "Don't sweat it. You can email us at eleswooddesigns@gmail.com anytime. We're woodworkers too and happy to help you get your project back on track."
  },
  {
    q: "DO YOU OFFER METRIC OR IMPERIAL MEASUREMENTS?",
    a: "Our current plans focus on Imperial measurements (inches) as requested by our primary audience, but we're working on metric versions for all designs!"
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2 leading-none">F.A.Q.</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Everything you need to know before you build.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFE500] group transition-colors">
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter group-hover:bg-black group-hover:text-white inline-block px-1">
              Q: {faq.q}
            </h2>
            <p className="font-bold text-lg leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-black text-white p-12 text-center border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,229,0,1)]">
        <h3 className="text-3xl font-black uppercase mb-4">STILL HAVE QUESTIONS?</h3>
        <p className="font-bold mb-8 text-gray-400">Can't find what you're looking for?</p>
        <a href="/contact/" className="inline-block bg-[#FFE500] text-black px-8 py-4 font-black uppercase tracking-widest hover:scale-105 transition-transform">
          Contact Support
        </a>
      </div>
    </div>
  );
}
