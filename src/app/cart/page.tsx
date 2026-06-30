"use client";

import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import Link from "next/link";
import { useT } from "@/components/T";
import TranslatedText from "@/components/TranslatedText";
import { Trash2, ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const t = useT();
  const { items, removeItem, updateQuantity, totalIQD } = useCart();
  const { convert } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center">
          <ShoppingCart size={40} className="text-[var(--accent)]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("cart.empty")}</h1>
        <p className="text-[var(--text-muted)] mb-8">{t("cart.startShopping")}</p>
        <Link href="/store" className="btn btn-primary btn-lg">
          {t("cart.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("cart.title")}</h1>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="card card-hover flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                "🎮"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="font-semibold text-sm hover:text-[var(--accent)] transition-colors"
              >
                <TranslatedText ar={item.name} ku={item.nameKu} />
              </Link>
              <div className="text-sm price mt-0.5">
                {convert(item.priceIQD)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="text-sm font-bold w-20 text-left price">
              {convert(item.priceIQD * item.quantity)}
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-[var(--accent-subtle)] to-[var(--bg-card)] border-[var(--accent)]/10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-bold">{t("cart.total")}</span>
          <span className="text-2xl font-extrabold price price-lg">
            {convert(totalIQD)}
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/store" className="btn btn-outline flex-1">
            <ArrowLeft size={16} />
            {t("cart.startShopping")}
          </Link>
          <Link href="/checkout" className="btn btn-primary flex-1 btn-lg">
            {t("cart.checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
