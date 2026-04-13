import Link from "next/link";
import { ArrowRight, Download, Star, Hammer } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        {/* Wood grain lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.grain} style={{ top: `${i * 9}%` }} />
        ))}
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.left}>
          <div className={styles.label}>
            <Star size={14} fill="#FFD60A" color="#FFD60A" />
            <span>4.9 ✦ 3,000+ happy carpenters</span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleLine1}>Woodworking DIY</span>
            <br />
            <span className={styles.titleHighlight}>Plans</span>
            <br />
            <span className={styles.titleLine3}>In One PDF.</span>
          </h1>

          <p className={styles.subtitle}>
            If you're busy with wood, you're in the right place. Build your own furniture
            with professional drawings, step-by-step instructions, and parts lists.
          </p>

          <div className={styles.ctas}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Explore Plans
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://www.etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              <Download size={20} />
              Buy on Etsy
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>12+</span>
              <span className={styles.statLabel}>Unique Plans</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>PDF</span>
              <span className={styles.statLabel}>Instant Download</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>5★</span>
              <span className={styles.statLabel}>Etsy Rating</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.bigCard}>
            <div className={styles.cardInner}>
              <Hammer size={64} className={styles.bigIcon} />
              <span className={styles.bigCardTitle}>Build it yourself</span>
              <span className={styles.bigCardSub}>Every plan is detailed and clear</span>
            </div>
            <div className={styles.floatBadge1}>
              <span>☆</span> New Plan
            </div>
            <div className={styles.floatBadge2}>
              Starts from $3.49
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={styles.tickerItems}>
              ✦ Furniture Plans &nbsp;&nbsp; ✦ Garden & Outdoor &nbsp;&nbsp; ✦ Decoration &nbsp;&nbsp; ✦ Kids Room &nbsp;&nbsp; ✦ Kitchen Accessories &nbsp;&nbsp; ✦ Instant PDF Download &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
