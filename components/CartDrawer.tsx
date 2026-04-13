"use client";

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <aside className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={20} />
            <span>Your Cart</span>
            {totalItems > 0 && (
              <span className={styles.count}>{totalItems}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p>Your cart is empty</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map(({ product, quantity }) => (
                <li key={product.id} className={styles.item}>
                  <div className={styles.imgWrap}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{product.name}</p>
                    <p className={styles.category}>{product.category}</p>
                    <div className={styles.controls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qty}>{quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <p className={styles.price}>${(product.price * quantity).toFixed(2)}</p>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Total</span>
              <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="btn btn-primary btn-block"
              onClick={() => setIsOpen(false)}
            >
              Proceed to Checkout →
            </Link>
            <button
              className="btn btn-outline btn-block btn-sm"
              onClick={() => setIsOpen(false)}
              style={{ marginTop: "8px" }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
