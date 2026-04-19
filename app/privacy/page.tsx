import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ElesWoodDesigns",
  description: "Read our privacy policy to understand how we handle your personal information.",
  alternates: {
    canonical: "https://eleswooddesigns.com/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12 border-b-8 border-black pb-8">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2 leading-none">Privacy Policy</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Last Updated: April 14, 2026</p>
      </div>

      <div className="space-y-12 font-bold text-lg leading-relaxed">
        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">1. Information We Collect</h2>
          <p className="mb-4">
            At ElesWoodDesigns, we take your privacy seriously. We collect information you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Make a purchase (Name, Email, Payment Info)</li>
            <li>Sign up for our newsletter</li>
            <li>Contact us for support</li>
          </ul>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">2. How We Use Your Info</h2>
          <p className="mb-4">
            We use the data we collect to provide, maintain, and improve our services, including to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process transactions and send related information.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Communicate with you about products, services, and events.</li>
          </ul>
        </section>

        <section className="bg-black text-white p-8 shadow-[12px_12px_0px_0px_rgba(255,229,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6 text-[#FFE500]">3. Cookies & Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to analyze trends, administer the website, and track users’ movements around the website. You can control the use of cookies at the individual browser level.
          </p>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
          </p>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6 bg-[#FFE500] inline-block px-2 border-2 border-black">5. Contact Us</h2>
          <p>
            If there are any questions regarding this privacy policy, you may contact us at eleswooddesigns@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
