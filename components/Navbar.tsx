"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Hammer } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Hammer size={24} />
          <span>WoodCraft</span>
          <span className={styles.logoSub}>Plans</span>
        </Link>

        <ul className={`${styles.links} ${mobileOpen ? styles.linksOpen : ""}`}>
          <li><Link href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
          <li><Link href="/products" onClick={() => setMobileOpen(false)}>Plans</Link></li>
          <li><Link href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
          <li>
            <a href="https://www.etsy.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className={styles.etsyLink}>
              Find on Etsy
            </a>
          </li>
        </ul>

        <div className={styles.actions}>
          <button
            id="cart-button"
            className={styles.cartBtn}
            onClick={() => setIsOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </button>

          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menüyü aç/kapat"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
