import Link from "next/link";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import { ArrowRight, Hammer, Download, CheckCircle, Mail, Star } from "lucide-react";

export default function HomePage() {
  const products = getProducts();
  const featured = products.filter(p => p.bestseller).slice(0, 6);
  if (featured.length < 6) {
    featured.push(...products.filter(p => !p.bestseller).slice(0, 6 - featured.length));
  }

  return (
    <div className="flex flex-col">
      {/* 1. DYNAMIC HERO SECTION */}
      <section className="bg-white border-b-4 border-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFE500] border-l-4 border-black hidden lg:block z-0"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 relative z-10">
          
          {/* Left Text */}
          <div className="py-20 px-6 md:px-12 flex flex-col justify-center">
            <div className="inline-block bg-black text-white px-3 py-1 font-bold text-xs uppercase tracking-widest w-max mb-6">
              Instant PDF Downloads
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] uppercase">
              Build your<br />masterpiece.
            </h1>
            <p className="text-xl md:text-2xl font-bold max-w-lg mb-10 text-gray-800">
              Premium woodworking blueprints. Step-by-step guides, 3D diagrams, and precise cut lists for makers of all levels.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-neo text-xl py-5 px-8 group">
                SHOP ALL PLANS
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="py-12 lg:py-20 px-6 lg:px-12 flex items-center justify-center bg-[#FFE500] lg:bg-transparent border-t-4 border-black lg:border-t-0">
             <div className="relative w-full max-w-md aspect-square card-neo bg-white p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full border-4 border-black bg-[url('https://cdn.pixabay.com/photo/2016/11/19/20/55/apples-1841132_1280.jpg')] bg-cover bg-center grayscale contrast-125"></div>
                <div className="absolute -bottom-6 -left-6 bg-white border-4 border-black p-4 shadow-neo flex items-center gap-3">
                  <Star className="w-8 h-8 fill-[#FFE500] text-black" />
                  <div>
                    <p className="font-black text-lg leading-none">5.0 RATING</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">From 500+ Builders</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / TRUST SIGNALS */}
      <section className="bg-black text-white border-b-4 border-black py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y-4 md:divide-y-0 md:divide-x-4 divide-white">
            <div className="flex flex-col items-center p-4">
              <Download className="w-12 h-12 mb-4 text-[#FFE500]" />
              <h3 className="text-2xl font-black uppercase mb-2">Instant Access</h3>
              <p className="font-bold text-gray-400">Download your PDF plans instantly after checkout. Start building today.</p>
            </div>
            <div className="flex flex-col items-center p-4 pt-8 md:pt-4">
              <Hammer className="w-12 h-12 mb-4 text-[#FFE500]" />
              <h3 className="text-2xl font-black uppercase mb-2">Beginner Friendly</h3>
              <p className="font-bold text-gray-400">Clear 3D diagrams, color-coded steps, and comprehensive terminology guides.</p>
            </div>
            <div className="flex flex-col items-center p-4 pt-8 md:pt-4">
              <CheckCircle className="w-12 h-12 mb-4 text-[#FFE500]" />
              <h3 className="text-2xl font-black uppercase mb-2">Full Cut Lists</h3>
              <p className="font-bold text-gray-400">Save money and time at the lumber yard with our optimized shopping & cut lists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL CATEGORIES */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full border-b-4 border-black">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase inline-block border-b-8 border-[#FFE500] px-4">Shop By Category</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/products" className="group card-neo block">
             <div className="aspect-video bg-blue-100 border-b-2 border-black flex flex-col items-center justify-center p-8 group-hover:bg-[#FFE500] transition-colors relative overflow-hidden">
                <Hammer className="w-16 h-16 mb-4 z-10" />
                <h3 className="text-3xl font-black uppercase z-10">Outdoor</h3>
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')]"></div>
             </div>
          </Link>
          <Link href="/products" className="group card-neo block">
             <div className="aspect-video bg-green-100 border-b-2 border-black flex flex-col items-center justify-center p-8 group-hover:bg-[#FFE500] transition-colors relative overflow-hidden">
                <Hammer className="w-16 h-16 mb-4 z-10" />
                <h3 className="text-3xl font-black uppercase z-10">Furniture</h3>
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')]"></div>
             </div>
          </Link>
          <Link href="/products" className="group card-neo block">
             <div className="aspect-video bg-red-100 border-b-2 border-black flex flex-col items-center justify-center p-8 group-hover:bg-[#FFE500] transition-colors relative overflow-hidden">
                <Hammer className="w-16 h-16 mb-4 z-10" />
                <h3 className="text-3xl font-black uppercase z-10">Kids & Play</h3>
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')]"></div>
             </div>
          </Link>
        </div>
      </section>

      {/* 4. BEST SELLERS GRID */}
      <section className="bg-gray-50 border-b-4 border-black py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
            <div className="text-center md:text-left">
              <span className="bg-[#FFE500] text-black border-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-widest shadow-neo-sm">Trending Now</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mt-4 uppercase">Popular Plans</h2>
            </div>
            <Link href="/products" className="btn-neo-secondary whitespace-nowrap">
              VIEW ALL <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIAL / SOCIAL PROOF */}
      <TestimonialsSection />

      {/* 6. NEWSLETTER CTA */}
      <section className="bg-[#FFE500] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center card-neo bg-white p-8 md:p-16">
          <Mail className="w-16 h-16 mx-auto mb-6 text-black" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Join the Maker Club</h2>
          <p className="text-xl font-bold mb-8 text-gray-700">
            Subscribe for free mini-plans, tool recommendations, and exclusive discounts. No spam, just sawdust.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="input-neo flex-grow text-lg h-14"
              required
            />
            <button type="submit" className="btn-neo bg-black text-white hover:text-black h-14 whitespace-nowrap">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
