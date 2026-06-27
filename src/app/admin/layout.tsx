"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Key,
  FolderTree,
  Settings,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الأقسام", icon: FolderTree },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/keys", label: "المفاتيح", icon: Key },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-8">
      <aside className="hidden md:block w-56 flex-shrink-0">
        <div className="card sticky top-24 p-2 space-y-0.5">
          {sidebarLinks.map((link) => {
            const isActive = link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
