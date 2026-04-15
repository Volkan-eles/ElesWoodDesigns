import { getProductBySlug, getProducts } from "@/lib/products";
import { getPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ImageGallery from "@/components/ImageGallery";
import Badge from "@/components/Badge";
import RelatedProducts from "@/components/RelatedProducts";
import Link from "next/link";
import PinterestSaveButton from "@/components/PinterestSaveButton";
import { Star, CheckCircle, ExternalLink, ArrowLeft, Clock, Ruler, BarChart, BookOpen, ShoppingBag } from "lucide-react";

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
    alternates: {
      canonical: `/products/${product.slug}/`,
    },
    description: `Build your own ${product.name} with our professional DIY woodworking plans. This detailed step-by-step PDF guide includes 3D diagrams, a precise cut list, and a full material shopping list. Instant digital download.`,
    openGraph: {
      title: `${product.name} | ElesWoodDesigns`,
      description: product.description,
      url: `https://eleswooddesigns.com/products/${product.slug}/`,
      type: 'website', // Keep as website but Pinterest will see the product tags below
      images: [
        {
          url: product.image,
          width: 1000,
          height: 1500,
          alt: `${product.name} Woodworking Plans`,
        },
      ],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'USD',
      'og:availability': 'instock',
      'product:retailer_item_id': product.id,
      'product:condition': 'new',
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) notFound();

  const baseUrl = "https://eleswooddesigns.com";
  
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'ElesWoodDesigns'
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}/`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'ElesWoodDesigns'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
      bestRating: '5',
      worstRating: '1'
    }
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Products',
        'item': `${baseUrl}/products/`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.name,
        'item': `${baseUrl}/products/${product.slug}/`
      }
    ]
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Is this woodworking plan beginner friendly?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes, this project is rated as ${product.difficulty}. Our plans include step-by-step 3D diagrams and clear instructions.`
        }
      },
      {
        '@type': 'Question',
        'name': 'What is included in the download?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You will receive a comprehensive PDF guide, complete materials and shopping list, precise cut list, and helpful assembly tips.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I receive the plans?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'All plans are instant digital downloads. Once your payment is processed on Etsy, you can download the PDF files immediately.'
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Link href="/products/" className="inline-flex items-center gap-2 font-black uppercase text-sm mb-8 hover:underline decoration-4 underline-offset-4 decoration-[#FFE500]">
        <ArrowLeft className="w-4 h-4" />
        Back to all plans
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-start-1 lg:row-start-1 flex flex-col gap-12">
          <ImageGallery 
            images={product.images} 
            thumbnails={product.imagesThumbnails} 
            alt={`DIY ${product.name} Woodworking Blueprint - Step-by-Step Plan`} 
            productName={product.name}
            productUrl={`${baseUrl}/products/${product.slug}/`}
          />
        </div>

        {/* Right: Info - Stacks below gallery on mobile, stays right on desktop */}
        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 flex flex-col gap-8">
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

            <div className="flex flex-col gap-1 mb-8">
              {product.originalPrice && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-gray-400 line-through tracking-tighter decoration-4">
                    ${product.originalPrice}
                  </span>
                  <span className="bg-[#FF5C00] text-white font-black text-sm px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
                    70% OFF SITEWIDE
                  </span>
                </div>
              )}
              <div className="text-6xl md:text-7xl font-black underline decoration-8 decoration-[#FFE500] underline-offset-[-4px] inline-block tracking-tighter">
                ${product.price}
              </div>
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

            {product.polar_price_id && (
              <Link 
                href={`/api/checkout?price_id=${product.polar_price_id}`}
                className="btn-neo text-2xl h-24 md:h-28 group text-center flex items-center justify-center gap-4 bg-[#FFE500]"
              >
                BUY PDF PLANS DIRECTLY
                <ShoppingBag className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </Link>
            )}

            <PinterestSaveButton 
              url={`${baseUrl}/products/${product.slug}/`}
              media={product.image}
              description={`${product.name} - DIY Woodworking Plans by ElesWoodDesigns. Professional PDF blueprints with 3D diagrams and cut lists.`}
              variant="large"
              className="h-24 md:h-28 text-2xl"
            />

            <p className="text-center font-bold text-xs text-gray-400 uppercase tracking-widest bg-gray-100 py-3 border-2 border-black border-dashed">
              Instant PDF Access • Secure Checkout • 5-Star Rated
            </p>
          </div>

          <div className="border-4 border-black p-8 bg-white shadow-neo">
            <h3 className="font-black text-2xl mb-6 uppercase underline decoration-4 underline-offset-4">What's Included:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center gap-4 font-bold text-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span>Comprehensive PDF Guide</span>
              </li>
              <li className="flex items-center gap-4 font-bold text-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span>Full Material Shopping List</span>
              </li>
              <li className="flex items-center gap-4 font-bold text-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span>Precise Cut List</span>
              </li>
              <li className="flex items-center gap-4 font-bold text-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span>Step-by-Step 3D Diagrams</span>
              </li>
               <li className="flex items-center gap-4 font-bold text-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span>Instant Digital Access</span>
              </li>
              <li className="flex items-center gap-4 font-bold text-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
                <span>Professional Blueprints</span>
              </li>
            </ul>
          </div>

          <div className="border-4 border-black p-8 bg-[#FFE500] shadow-neo">
            <h3 className="font-black text-2xl mb-6 uppercase underline decoration-4 underline-offset-4">Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 font-bold text-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-black flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#FFE500]" />
                  </div>
                  <span className="capitalize">{feature}</span>
                </li>
              ))}
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

        {/* Project Details - Stacks below Info on mobile, moves back to left column on desktop */}
        <div className="lg:col-start-1 lg:row-start-2 mt-8 lg:mt-0">
          <h3 className="font-black text-2xl mb-4 uppercase inline-block border-b-4 border-[#FFE500]">Project Details</h3>
          <div className="text-lg font-bold text-gray-700 leading-relaxed whitespace-pre-wrap card-neo p-6 bg-white">
            {product.longDescription || product.description}
          </div>
        </div>
      </div>

      {/* Internal Linking: Related Blog Guides */}
      <div className="mt-20 pt-20 border-t-4 border-black mb-20">
        <h3 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
          <BookOpen className="w-8 h-8" />
          Related Building Guides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getPosts()
            .filter(post => post.category.toLowerCase() === product.category.toLowerCase() || post.category === "Tips & Tricks")
            .slice(0, 3)
            .map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}/`} className="card-neo bg-white p-6 group">
                <div className="text-xs font-black text-[#FF5C00] uppercase mb-2">{post.category}</div>
                <h4 className="font-black text-xl uppercase mb-4 group-hover:underline decoration-4 underline-offset-4 decoration-[#FFE500]">
                  {post.title}
                </h4>
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase pt-4 border-t border-gray-100">
                  <span>Read Guide</span>
                  <span>→</span>
                </div>
              </Link>
            ))
          }
        </div>
      </div>

      {/* Cross-Selling Section */}
      <RelatedProducts currentSlug={product.slug} category={product.category} />
    </div>
  );
}
