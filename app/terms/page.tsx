import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ElesWoodDesigns",
  description: "Read our terms of service to understand the rules for using our website and purchasing our plans.",
  alternates: {
    canonical: "https://eleswooddesigns.com/terms/",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12 border-b-8 border-black pb-8">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2 leading-none">Terms of Service</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Last Updated: April 14, 2026</p>
      </div>

      <div className="space-y-12 font-bold text-lg leading-relaxed text-black">
        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website’s particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">2. Intellectual Property</h2>
          <p className="mb-4">
            The plans, designs, and content provided on ElesWoodDesigns are the intellectual property of ElesWoodDesigns. 
          </p>
          <div className="bg-black text-white p-4 uppercase tracking-tighter text-sm">
            IMPORTANT: These plans are for personal use only. Commercial reproduction or resale of the digital files is strictly prohibited.
          </div>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">3. Liability</h2>
          <p>
            Woodworking involves inherent risks. ElesWoodDesigns is not responsible for any accidents, injuries, or damaged materials that occur during the use of our plans. Always wear protective gear and follow tool manufacturer safety guidelines.
          </p>
        </section>

        <section className="bg-[#FFE500] border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6">4. Modifications</h2>
          <p>
            We reserve the right to change these conditions from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms.
          </p>
        </section>
      </div>
    </div>
  );
}
