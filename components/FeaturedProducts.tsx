import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import styles from "./FeaturedProducts.module.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <section className="section bg-cream">
      <div className="container">
        <div className="section-title">
          <h2>Top Selling Plans</h2>
          <div className={styles.line} />
        </div>

        <div className="grid-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/products" className="btn btn-outline btn-lg">
            See All Plans
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
