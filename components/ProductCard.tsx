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
    <article className={styles.card} id={`product-${product.id}`}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
        <Image
          src={product.thumbnail || product.image}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          quality={90}
        />
        {product.badge && (
          <span className={`badge ${BADGE_CLASS[product.badge] || "badge-orange"} ${styles.badge}`}>
            {product.badge}
          </span>
        )}
        <div className={styles.overlay}>
          <span className={styles.overlayText}>See Details →</span>
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span
            className={`badge badge-cream`}
            style={{ borderColor: "currentColor" }}
          >
            {product.category}
          </span>
          <span
            className={styles.difficulty}
            style={{ color: DIFFICULTY_COLOR[product.difficulty] }}
          >
            ● {product.difficulty}
          </span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        <p className={styles.desc}>{product.description}</p>

        <div className={styles.stats}>
          <span className={styles.stat}>
            <Star size={12} fill="#FFD60A" color="#FFD60A" />
            <span className="mono">{product.rating}</span>
            <span className={styles.reviews}>({product.reviewCount} reviews)</span>
          </span>
          <span className={styles.stat}>
            <Clock size={12} />
            {product.estimatedTime}
          </span>
          <span className={styles.stat}>
            <BookOpen size={12} />
            {product.pages} pages
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>PDF Plan</span>
            <span className={styles.priceValue}>${product.price.toFixed(2)}</span>
          </div>
          <button
            id={`add-to-cart-${product.id}`}
            className={`btn btn-primary btn-sm ${styles.addBtn}`}
            onClick={() => addItem(product)}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
