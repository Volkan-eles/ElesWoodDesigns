import styles from "./CategorySection.module.css";
import Link from "next/link";
import { Sofa, TreePine, Home, Baby, ChefHat } from "lucide-react";

const categories = [
  { name: "Furniture", icon: <Sofa size={32} />, color: "var(--orange)", count: 4 },
  { name: "Garden", icon: <TreePine size={32} />, color: "var(--green-light)", count: 3 },
  { name: "Decoration", icon: <Home size={32} />, color: "var(--yellow)", count: 2 },
  { name: "Kids", icon: <Baby size={32} />, color: "var(--red)", count: 2 },
  { name: "Kitchen", icon: <ChefHat size={32} />, color: "var(--cream-dark)", count: 4 },
];

export default function CategorySection() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-title">
          <h2>Categories</h2>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className={styles.card}
              style={{ "--bg-hover": cat.color } as any}
            >
              <div className={styles.icon}>{cat.icon}</div>
              <h3 className={styles.name}>{cat.name}</h3>
              <span className={styles.count}>{cat.count} Plans</span>
              <div className={styles.arrow}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
