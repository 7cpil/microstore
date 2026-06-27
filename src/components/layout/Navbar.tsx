"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, Package, LogOut, ChevronDown, Store, X } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/lib/CurrencyContext";

const categories = [
  { name: "Micro", slug: "micro" },
  { name: "جيمينج", slug: "gaming" },
  { name: "برامج", slug: "software" },
  { name: "تصميم", slug: "design" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { currency, setCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]" />
      <div className="relative container flex items-center justify-between h-16 md:h-18">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Store size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">
              Micro Store
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/store/${cat.slug}`}
                className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] rounded-lg transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/store"
              className="px-3 py-2 text-sm text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-all duration-200 font-medium"
            >
              الكل
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "IQD" | "USD" | "SAR")}
            className="input !w-auto !py-1.5 !px-3 text-sm !bg-[var(--bg-card)]"
          >
            <option value="IQD">د.ع</option>
            <option value="USD">$</option>
            <option value="SAR">ر.س</option>
          </select>

          <Link
            href="/cart"
            className="relative p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all duration-200"
            aria-label="السلة"
          >
            <ShoppingCart size={19} />
          </Link>

          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-all duration-200">
                <User size={18} />
                <span className="hidden sm:block text-sm max-w-[90px] truncate">
                  {session.user?.name}
                </span>
                <ChevronDown size={14} className="hidden sm:block group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-elevated)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{session.user?.email}</p>
                </div>
                <Link
                  href="/orders"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
                >
                  <Package size={16} />
                  طلباتي
                </Link>
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
                  >
                    <Store size={16} />
                    لوحة التحكم
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] w-full text-right transition-colors border-t border-[var(--border)]"
                >
                  <LogOut size={16} />
                  تسجيل خروج
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm">
              تسجيل الدخول
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-all duration-200 md:hidden"
            aria-label="القائمة"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden relative bg-[var(--bg-card)] border-t border-[var(--border)] animate-fade-in">
          <div className="container py-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/store/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] rounded-lg transition-all"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/store"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-all font-medium"
            >
              جميع المنتجات
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
