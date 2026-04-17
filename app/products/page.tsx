import { getProducts } from "@/lib/products";
import ProductListingClient from "./ProductListingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIY Woodworking Plans — PDF Blueprints for Every Skill Level | ElesWoodDesigns",
  description:
    "Browse 60+ professional DIY woodworking plans. Instant PDF download with 3D diagrams, precise cut lists, and full material lists. Build furniture, garden projects, outdoor structures & more.",
  alternates: {
    canonical: "/products/",
  },
  openGraph: {
    title: "DIY Woodworking Plans — 60+ Premium PDF Blueprints | ElesWoodDesigns",
    description:
      "Step-by-step woodworking blueprints for furniture, garden, outdoor, kitchen, and workshop projects. Download instantly and build with confidence.",
    url: "https://eleswooddesigns.com/products/",
    type: "website",
    images: [
      {
        url: "https://eleswooddesigns.com/logo.png",
        width: 800,
        height: 600,
        alt: "ElesWoodDesigns DIY Woodworking Plans",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const products = getProducts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ElesWoodDesigns Woodworking Plans",
    description:
      "A collection of professional DIY woodworking plans including furniture, garden, outdoor, kitchen, and workshop projects.",
    url: "https://eleswooddesigns.com/products/",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://eleswooddesigns.com/products/${product.slug}/`,
      name: product.name,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mb-12 border-b-4 border-black pb-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
          Woodworking
          <br />
          Plans
        </h1>
        <div className="max-w-3xl">
          <p className="font-bold text-lg mb-6 leading-relaxed">
            Transform your workshop with our professional, field-tested DIY
            woodworking plans. Whether you&apos;re building a grand pergola for
            your garden, a modern farmhouse dining table, or a secure wood
            storage shed, ElesWoodDesigns provides the precision blueprints you
            need to succeed.
          </p>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-sm leading-loose">
            Every plan in our collection is meticulously crafted with the modern
            maker in mind. We provide more than just a sketch; each download
            includes a comprehensive PDF guide featuring hyper-realistic 3D
            assembly diagrams, a precise cut list to minimize waste, and a full
            material shopping list to streamline your trip to the lumber yard.
            From beginner-friendly garden projects to advanced furniture builds,
            our blueprints ensure professional results every time. Build it
            yourself, build it bold, and build it to last.
          </p>
        </div>
      </div>

      <ProductListingClient initialProducts={products} />
    </div>
  );
}
