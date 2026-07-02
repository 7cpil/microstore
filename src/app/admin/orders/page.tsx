"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Check, X, Eye } from "lucide-react";

type Order = {
  id: string;
  user: { name: string; email: string };
  totalIQD: number;
  status: string;
  paymentMethod: string;
  receiptImage: string | null;
  note: string | null;
  socialPlatform: string | null;
  socialHandle: string | null;
  createdAt: string;
  items: { id: string; product: { name: string }; quantity: number; priceIQDAtPurchase: number; deliveryKey: { value: string } | null }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else toast.error("فشل تحميل الطلبات");
      })
      .catch(() => toast.error("فشل تحميل الطلبات"));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const label =
      status === "PAID" ? "تأكيد الدفع" :
      status === "DELIVERED" ? "توصيل المفاتيح" : "إلغاء";

    if (!confirm(`هل أنت متأكد من ${label}؟`)) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`تم ${label}`);
      load();
    } catch {
      toast.error("فشل التحديث");
    }
  };

  const statusBadge: Record<string, string> = {
    PENDING: "badge-yellow",
    PAID: "badge-purple",
    DELIVERED: "badge-green",
    CANCELLED: "badge-red",
  };
  const statusText: Record<string, string> = {
    PENDING: "قيد المراجعة",
    PAID: "تم الدفع",
    DELIVERED: "تم التوصيل",
    CANCELLED: "ملغي",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الطلبات</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{order.user.name}</span>
                <span className="text-xs text-[var(--muted)]">({order.user.email})</span>
                <span className={`badge ${statusBadge[order.status]}`}>{statusText[order.status]}</span>
              </div>
              <div className="text-sm font-bold">{order.totalIQD.toLocaleString()} د.ع</div>
            </div>

            <div className="text-sm text-[var(--muted)] mb-3">
              {new Date(order.createdAt).toLocaleDateString("ar-IQ")} · {order.paymentMethod === "email" ? "بريد إلكتروني" : order.paymentMethod === "social" ? `سوشيال ميديا (${order.socialPlatform}: ${order.socialHandle})` : order.paymentMethod}
              {order.note && ` · ملاحظة: ${order.note}`}
            </div>

            {order.receiptImage && (
              <a href={order.receiptImage} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1 mb-3">
                <Eye size={14} /> عرض الإيصال
              </a>
            )}

            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-3 block"
            >
              {expanded === order.id ? "إخفاء المنتجات" : `عرض المنتجات (${order.items.length})`}
            </button>

            {expanded === order.id && (
              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="text-sm py-1 px-2 rounded bg-white/5">
                    <div className="flex justify-between">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>{(item.priceIQDAtPurchase * item.quantity).toLocaleString()} د.ع</span>
                    </div>
                    {item.deliveryKey && (
                      <div className="text-xs text-green-400 mt-1 font-mono" dir="ltr">
                        ✅ المفتاح: {item.deliveryKey.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {order.status === "PENDING" && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(order.id, "PAID")} className="btn btn-primary btn-sm">
                  <Check size={14} /> تأكيد الدفع
                </button>
                <button onClick={() => updateStatus(order.id, "CANCELLED")} className="btn btn-danger btn-sm">
                  <X size={14} /> إلغاء
                </button>
              </div>
            )}
            {order.status === "PAID" && (
              <button onClick={() => updateStatus(order.id, "DELIVERED")} className="btn btn-primary btn-sm">
                <Check size={14} /> تم التوصيل
              </button>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-8 text-[var(--muted)]">لا توجد طلبات</div>
        )}
      </div>
    </div>
  );
}
