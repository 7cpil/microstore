import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusBadge: Record<string, string> = {
    PENDING: "badge-yellow",
    PAID: "badge-purple",
    DELIVERED: "badge-green",
    CANCELLED: "badge-red",
  };

  const statusText: Record<string, string> = {
    PENDING: "قيد المراجعة",
    PAID: "تم تأكيد الدفع",
    DELIVERED: "تم التوصيل",
    CANCELLED: "ملغي",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center">
            <Package size={40} className="text-[var(--accent)]" />
          </div>
          <p className="text-lg text-[var(--text-muted)] mb-6">لا توجد طلبات بعد</p>
          <Link href="/store" className="btn btn-primary btn-lg">
            تسوق الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="card card-hover block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--text-muted)]">
                    {new Date(order.createdAt).toLocaleDateString("ar-IQ")}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-muted)]">
                    {order.items.length} منتج
                  </span>
                </div>
                <span className={`badge ${statusBadge[order.status]}`}>
                  {statusText[order.status]}
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-lg flex-shrink-0">
                      🎮
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.product.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">الكمية: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold text-[var(--accent)]">
                      {(item.priceIQDAtPurchase * item.quantity).toLocaleString()} د.ع
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)]">
                  {order.paymentMethod === "asia_cell" ? "آسيا سيل" : order.paymentMethod}
                </span>
                <span className="font-bold price">
                  {order.totalIQD.toLocaleString()} د.ع
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
