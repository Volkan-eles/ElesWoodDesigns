"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import styles from "./FaqSection.module.css";

const faqs = [
  {
    question: "How will I receive the plans?",
    answer: "After completing your payment via Etsy, the PDF files will be available for instant download. Additionally, a download link will be sent to your registered email address by the system."
  },
  {
    question: "Is it suitable for beginners?",
    answer: "Yes! Our plans are categorized as 'Easy', 'Medium', and 'Hard'. Plans labeled 'Easy' can be successfully completed even with basic hand tools."
  },
  {
    question: "Is the material list included?",
    answer: "Absolutely. Each plan includes a detailed shopping and parts list, from the types of wood to be used to screw sizes."
  },
  {
    question: "Which measurement units do you use?",
    answer: "Our plans offer both Metric (cm/mm) and Imperial (inches) units together. You won't have any trouble whichever system you use."
  },
  {
    question: "What if I lose my files?",
    answer: "Don't worry! You can always access and download your plans again from the 'Purchases' section on your Etsy account."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section bg-cream">
      <div className="container">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openIndex === index ? styles.open : ""}`}
            >
              <button
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              <div className={styles.answer}>
                <div className={styles.answerInner}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
