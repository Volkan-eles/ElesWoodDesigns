import { getPosts } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Woodworking Guides & Tips | ElesWoodDesigns Blog",
  description: "Expert advice on woodworking tools, lumber selection, and DIY tips to help you build your masterpiece.",
  alternates: {
    canonical: "/blog/",
  },
};

export default function BlogListPage() {
  const posts = getPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-[0.9]">
          Woodworking<br />Insights
        </h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm max-w-xl">
          Elevate your craft with our latest guides, tool reviews, and professional tips for DIY builders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}/`} className="group">
            <article className="card-neo bg-white h-full flex flex-col overflow-hidden">
               <div className="aspect-video relative overflow-hidden border-b-4 border-black">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#FFE500] border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-neo-sm">
                    {post.category}
                  </div>
               </div>
               <div className="p-8 flex-grow flex flex-col">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 group-hover:underline decoration-4 underline-offset-4 decoration-[#FFE500]">
                    {post.title}
                  </h2>
                  <p className="font-bold text-gray-600 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-200">
                    <span className="text-xs font-black uppercase text-gray-400">{post.publishedAt}</span>
                    <span className="text-sm font-black uppercase flex items-center gap-2">
                       READ FULL GUIDE 
                       <span className="w-6 h-6 bg-black text-[#FFE500] flex items-center justify-center rounded-full">→</span>
                    </span>
                  </div>
               </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
