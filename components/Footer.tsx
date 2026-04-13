import Link from "next/link";
import { Hammer, Camera, Share2, ExternalLink, Heart } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar} />
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Hammer size={28} />
              <span>WoodCraft Plans</span>
            </Link>
            <p className={styles.tagline}>
              Create with your own hands. Every plan is an adventure.
            </p>
            <div className={styles.socials}>
              <a href="https://www.etsy.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                <ExternalLink size={16} />
                <span>Etsy Shop</span>
              </a>
              <a href="#" className={styles.socialIcon}>
                <Camera size={20} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Share2 size={20} />
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Plans</h4>
            <ul>
              <li><Link href="/products?category=Furniture">Furniture</Link></li>
              <li><Link href="/products?category=Garden">Garden</Link></li>
              <li><Link href="/products?category=Decoration">Decoration</Link></li>
              <li><Link href="/products?category=Kids">Kids</Link></li>
              <li><Link href="/products?category=Kitchen">Kitchen</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Information</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/about#faq">FAQ</Link></li>
              <li><a href="https://www.etsy.com" target="_blank" rel="noopener noreferrer">Order on Etsy</a></li>
            </ul>
          </div>

          <div className={styles.newsletter}>
            <h4>Stay Updated</h4>
            <p>New plans and discounts every month</p>
            <div className={styles.form}>
              <input
                type="email"
                placeholder="email@address.com"
                className="input"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.divider} />
          <div className={styles.bottomContent}>
            <p className={styles.copy}>
              © {new Date().getFullYear()} WoodCraft Plans. All rights reserved.
            </p>
            <p className={styles.made}>
              Made with <Heart size={14} fill="currentColor" /> in Turkey
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
