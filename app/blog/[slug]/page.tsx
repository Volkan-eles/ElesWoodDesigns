import { getPostBySlug, getPosts } from "@/lib/blog";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | ElesWood Designs Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://eleswooddesigns.com/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ElesWoodDesigns',
      logo: {
        '@type': 'ImageObject',
        url: 'https://eleswooddesigns.com/logo.png'
      }
    },
    description: post.excerpt,
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link href="/blog/" className="inline-flex items-center gap-2 font-black uppercase text-sm mb-12 hover:underline decoration-4 underline-offset-4 decoration-[#FFE500]">
        <ArrowLeft className="w-4 h-4" />
        Back to blog
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap gap-4 mb-4">
           <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500">
              <User className="w-4 h-4" />
              {post.author}
           </div>
           <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500">
              <Clock className="w-4 h-4" />
              {post.publishedAt}
           </div>
           <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF5C00]">
              <Tag className="w-4 h-4" />
              {post.category}
           </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
          {post.title}
        </h1>
        <div className="aspect-video relative border-4 border-black shadow-neo overflow-hidden">
           <img 
             src={post.image} 
             alt={post.title} 
             className="object-cover w-full h-full"
           />
        </div>
      </header>

      <div 
        className="prose prose-xl max-w-none font-bold text-lg leading-relaxed text-gray-800
          prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:mb-6 prose-h2:mt-12
          prose-h3:text-2xl prose-h3:font-black prose-h3:uppercase prose-h3:tracking-tight prose-h3:mb-4
          prose-p:mb-6
          prose-ol:mb-8 prose-ol:list-decimal prose-ol:pl-6
          prose-li:mb-2
        "
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-20 pt-20 border-t-4 border-black">
        <h3 className="text-3xl font-black uppercase mb-8">Recommended Plans for this Project:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {getProducts()
            .filter(p => p.category.toLowerCase() === post.category.toLowerCase() || post.category === "Guides")
            .slice(0, 2)
            .map(product => (
              <ProductCard key={product.slug} product={product} />
            ))
          }
        </div>
      </div>

      <div className="mt-12 p-12 bg-[#FFE500] border-4 border-black shadow-neo text-center">
        <h3 className="text-3xl font-black uppercase mb-4">Ready to start building?</h3>
        <p className="font-bold mb-8 max-w-lg mx-auto">
          Check out our premium woodworking plans and build your next masterpiece with confidence.
        </p>
        <Link href="/products/" className="btn-neo bg-black text-white hover:text-black">
          BROWSE ALL PLANS
        </Link>
      </div>
    </article>
  );
}
