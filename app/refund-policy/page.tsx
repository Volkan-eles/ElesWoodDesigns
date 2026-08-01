import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy | ElesWoodDesigns",
  description: "Read our 30-day money-back guarantee and return policy for DIY woodworking plans.",
  alternates: {
    canonical: "https://eleswooddesigns.com/refund-policy/",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12 border-b-8 border-black pb-8">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-2 leading-none">
          Refund & Return Policy
        </h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Last Updated: August 1, 2026</p>
      </div>

      <div className="space-y-8 font-bold text-lg leading-relaxed text-black">
        <section className="bg-[#FFE500] border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-4">30-Day 100% Money-Back Guarantee</h2>
          <p className="mb-4">
            At ElesWoodDesigns, customer satisfaction is our top priority. We offer a <strong>30-day money-back guarantee</strong> on all our digital PDF woodworking plans and blueprints for customers in the United States and internationally.
          </p>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Policy Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-black uppercase text-gray-500 block">Return Window</span>
              <span className="text-xl font-black">30 Calendar Days</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-gray-500 block">Return Fee / Restocking Fee</span>
              <span className="text-xl font-black text-green-700">$0 / 100% Free</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-gray-500 block">Eligible Products</span>
              <span className="text-xl font-black">All Digital PDF Blueprints</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-gray-500 block">Refund Processing Time</span>
              <span className="text-xl font-black">1 to 3 Business Days</span>
            </div>
          </div>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4">How to Request a Refund</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Send an email to <strong>eleswooddesigns@gmail.com</strong> with your order number or purchase receipt.</li>
            <li>Let us know the reason for your refund request (e.g. file defect, accidental purchase, or dissatisfaction).</li>
            <li>Our team will process your request within 24 hours and issue a 100% full refund back to your original payment method (Google Pay, Credit Card, PayPal).</li>
          </ol>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4">Contact Information</h2>
          <p>
            If you have any questions regarding our Refund & Return Policy, please reach out to us:
          </p>
          <p className="mt-2 text-xl font-black">
            Email: <a href="mailto:eleswooddesigns@gmail.com" className="underline decoration-4 decoration-[#FFE500]">eleswooddesigns@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
