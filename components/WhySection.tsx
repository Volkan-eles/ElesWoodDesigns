import { Ruler, FileText, Globe, Zap } from "lucide-react";
import styles from "./WhySection.module.css";

const reasons = [
  {
    icon: <Ruler size={40} />,
    title: "Millimetric Precision",
    desc: "We offer error-free projects where every part and cut dimension has been checked multiple times."
  },
  {
    icon: <FileText size={40} />,
    title: "Detailed Guides",
    desc: "Build as if there's a master by your side with step-by-step instructions and 3D visuals."
  },
  {
    icon: <Globe size={40} />,
    title: "Professional Support",
    desc: "All our plans are prepared with clear terms and easy-to-understand language."
  },
  {
    icon: <Zap size={40} />,
    title: "Instant Access",
    desc: "Download your PDF file as soon as you purchase and start your project immediately."
  }
];

export default function WhySection() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className={styles.grid}>
          {reasons.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
