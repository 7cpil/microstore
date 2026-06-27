import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, EyeOff, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">
          <Plus size={16} /> إضافة منتج
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="text-right px-4 py-3 font-medium">المنتج</th>
                <th className="text-right px-4 py-3 font-medium">القسم</th>
                <th className="text-right px-4 py-3 font-medium">السعر</th>
                <th className="text-right px-4 py-3 font-medium">الحالة</th>
                <th className="text-right px-4 py-3 font-medium">ظاهر</th>
                <th className="text-right px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {product.category.icon} {product.category.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--primary)] font-bold">
                    {product.priceIQD.toLocaleString()} د.ع
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        product.status === "IN_STOCK"
                          ? "badge-green"
                          : product.status === "LIMITED"
                          ? "badge-yellow"
                          : "badge-red"
                      }`}
                    >
                      {product.status === "IN_STOCK"
                        ? "متوفر"
                        : product.status === "LIMITED"
                        ? "محدود"
                        : "نفد"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.isVisible ? (
                      <Eye size={16} className="text-[var(--success)]" />
                    ) : (
                      <EyeOff size={16} className="text-[var(--muted)]" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      <Edit size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-8 text-[var(--muted)]">لا توجد منتجات</div>
        )}
      </div>
    </div>
  );
}
