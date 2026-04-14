import { getProductBySlug, getProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ImageGallery from "@/components/ImageGallery";
import Badge from "@/components/Badge";
import RelatedProducts from "@/components/RelatedProducts";
import { Star, CheckCircle, ExternalLink, ArrowLeft, Clock, Ruler, BarChart } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | ElesWoodDesigns`,
    description: product.description.slice(0, 160),
    keywords: product.tags,
    openGraph: {
      images: [product.image],
    },
    alternates: {
      canonical: `/products/${product.slug}/`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://eleswooddesigns.com/products/${product.slug}/`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ElesWoodDesigns'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/products" className="inline-flex items-center gap-2 font-black uppercase text-sm mb-8 hover:underline decoration-4 underline-offset-4 decoration-[#FFE500]">
        <ArrowLeft className="w-4 h-4" />
        Back to all plans
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        {/* Left: Interactive Image Gallery & Project Details */}
        <div className="flex flex-col gap-12">
          <ImageGallery 
            images={product.images} 
            thumbnails={product.imagesThumbnails} 
            alt={product.name} 
          />
          
          <div>
            <h3 className="font-black text-2xl mb-4 uppercase inline-block border-b-4 border-[#FFE500]">Project Details</h3>
            <div className="text-lg font-bold text-gray-700 leading-relaxed whitespace-pre-wrap card-neo p-6 bg-white">
              {product.longDescription || product.description}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{product.category}</Badge>
              <Badge className="bg-white">{product.difficulty} LEVEL</Badge>
              {product.bestseller && <Badge className="bg-[#FFE500]">BESTSELLER</Badge>}
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-[#FFE500] text-black' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-bold text-lg">{product.rating}</span>
              <span className="text-gray-400 font-bold underline text-sm uppercase">({product.reviewCount} REVIEWS)</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="border-2 border-black p-3 bg-gray-50 shadow-neo-sm flex flex-col items-center justify-center text-center">
                <Clock className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold uppercase text-gray-500">Est. Time</span>
                <span className="font-black text-sm uppercase">{product.estimatedTime}</span>
              </div>
              <div className="border-2 border-black p-3 bg-gray-50 shadow-neo-sm flex flex-col items-center justify-center text-center">
                <Ruler className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold uppercase text-gray-500">Plan Depth</span>
                <span className="font-black text-sm uppercase">{product.pages} Pages</span>
              </div>
              <div className="border-2 border-black p-3 bg-gray-50 shadow-neo-sm flex flex-col items-center justify-center text-center">
                <BarChart className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold uppercase text-gray-500">Difficulty</span>
                <span className="font-black text-sm uppercase">{product.difficulty}</span>
              </div>
            </div>

            <div className="text-6xl font-black mb-8 underline decoration-8 decoration-[#FFE500] underline-offset-[-4px] inline-block tracking-tighter">
              ${product.price}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href={product.etsy_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-neo text-2xl h-24 md:h-28 group text-center flex items-center justify-center gap-4"
            >
              DOWNLOAD PLANS ON ETSY
              <ExternalLink className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <p className="text-center font-bold text-xs text-gray-400 uppercase tracking-widest bg-gray-100 py-3 border-2 border-black border-dashed">
              Instant PDF Access • Secure Checkout • 5-Star Rated
            </p>
          </div>

          <div className="border-4 border-black p-8 bg-white shadow-neo">
            <h3 className="font-black text-2xl mb-6 uppercase underline decoration-4 underline-offset-4">Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 font-bold text-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                  <span className="capitalize">{feature}</span>
                </li>
              ))}
              <li className="flex items-center gap-4 font-bold text-lg">
                 <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                Cut & Shopping List
              </li>
            </ul>
          </div>



          {product.materials.length > 0 && product.materials[0] !== "" && (
            <div className="mt-4">
              <h3 className="font-black text-2xl mb-4 uppercase inline-block border-b-4 border-[#FFE500]">Required Materials</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((m, i) => (
                  <Badge key={i} className="bg-gray-100 border-dashed">{m}</Badge>
                ))}
              </div>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
             <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-300">
              <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Tags & Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag, i) => (
                  <span key={i} className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cross-Selling Section */}
      <RelatedProducts currentSlug={product.slug} category={product.category} />
    </div>
  );
}
