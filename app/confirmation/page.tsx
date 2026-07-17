import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="border-t-4 border-black bg-[#FFFDF0] min-h-[85vh] py-20 flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          {/* Neon Icon badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFE500] border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
            <span className="text-4xl">🎉</span>
          </div>

          <h1 className="font-black text-5xl md:text-6xl tracking-tighter uppercase mb-4 leading-none">
            THANK YOU!
          </h1>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-8">
            Your order has been processed successfully.
          </p>

          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-left mb-10">
            <h2 className="text-xl font-black uppercase mb-4 bg-[#FFE500] inline-block px-2 border-2 border-black">
              What Happens Next?
            </h2>
            <ul className="space-y-4 font-bold text-sm leading-relaxed text-black">
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base leading-none">✓</span>
                <span>An email has been sent to you from <strong>Polar.sh</strong> with your instant PDF download link.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base leading-none">✓</span>
                <span>Check your spam or junk folder if you don't receive the email within 2-3 minutes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base leading-none">✓</span>
                <span>For any questions or custom build support, reach out to us at <strong>eleswooddesigns@gmail.com</strong>.</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link 
              href="/products/" 
              className="btn-neo py-3 px-8 text-sm uppercase font-black bg-[#FFE500] border-3 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
