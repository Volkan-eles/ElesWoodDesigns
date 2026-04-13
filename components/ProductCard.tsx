"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, BookOpen, ShoppingCart, Zap } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

const BADGE_CLASS: Record<string, string> = {
  "BESTSELLER": "badge-orange",
  "NEW": "badge-green",
  "MOST POPULAR": "badge-yellow",
  "BEST SELLER": "badge-red",
  "SALE": "badge-black",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#2D5016",
  Medium: "#FF6B35",
  Hard: "#E63946",
};

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const { addItem } = useCart();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < Math.floor(rating) ? "#FFD60A" : "none"}
        color={i < Math.floor(rating) ? "#FFD60A" : "#9B9B95"}
      />
    ));
  };

  return (
    <article className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
        <Image
          src={product.thumbnail || product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          quality={90}
        />
        {product.badge && (
          <span className={`badge badge-orange ${styles.badge}`}>
            {product.badge}
          </span>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className="badge badge-orange text-xs">{product.category}</span>
          <div className={styles.stat}>
            <Star size={14} fill="#FFB800" color="#FFB800" />
            <span className={styles.rating}>{product.rating}</span>
            <span className={styles.reviews}>({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>Instant PDF</span>
            <span className={styles.priceValue}>${product.price.toFixed(2)}</span>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => addItem(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
