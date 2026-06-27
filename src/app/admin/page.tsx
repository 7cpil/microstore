import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, Clock, Key, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingOrders, keysTotal, keysUsed] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.deliveryKey.count(),
      prisma.deliveryKey.count({ where: { isUsed: true } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } }, items: { include: { product: true } } },
  });

  const stats = [
    { label: "منتج", value: productCount, icon: Package, color: "from-purple-500/20 to-purple-900/20 text-[var(--accent)]" },
    { label: "إجمالي الطلبات", value: orderCount, icon: ShoppingCart, color: "from-blue-500/20 to-blue-900/20 text-blue-400" },
    { label: "قيد المراجعة", value: pendingOrders, icon: Clock, color: "from-amber-500/20 to-amber-900/20 text-amber-400" },
    { label: "مفاتيح متبقية", value: keysTotal - keysUsed, icon: Key, color: "from-green-500/20 to-green-900/20 text-green-400" },
    { label: "مفاتيح مستخدمة", value: keysUsed, icon: CheckCircle, color: "from-slate-500/20 to-slate-900/20 text-slate-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card text-center group hover:border-[var(--accent)]/20 transition-all">
            <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-extrabold">{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-4">آخر الطلبات</h2>
      <div className="card !p-0 overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-5 py-3.5 text-sm hover:bg-[var(--accent-subtle)]/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-xs font-bold text-[var(--accent)] flex-shrink-0">
                  {order.user.name?.charAt(0) || "?"}
                </div>
                <div className="min-w-0">
                  <span className="font-medium">{order.user.name}</span>
                  <span className="text-[var(--text-muted)] mx-2">—</span>
                  <span className="text-[var(--text-muted)] text-xs">
                    {order.items.map((i) => i.product.name).join(", ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-bold text-sm">{order.totalIQD.toLocaleString()} د.ع</span>
                <span
                  className={`badge ${
                    order.status === "PENDING" ? "badge-yellow" :
                    order.status === "PAID" ? "badge-purple" :
                    order.status === "DELIVERED" ? "badge-green" : "badge-red"
                  }`}
                >
                  {order.status === "PENDING" ? "قيد المراجعة" :
                   order.status === "PAID" ? "تم الدفع" :
                   order.status === "DELIVERED" ? "تم التوصيل" : "ملغي"}
                </span>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="text-center py-10 text-[var(--text-muted)] text-sm">
              لا توجد طلبات بعد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
