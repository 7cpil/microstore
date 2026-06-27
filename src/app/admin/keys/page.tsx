"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Product = { id: string; name: string };
type DeliveryKey = {
  id: string;
  value: string;
  isUsed: boolean;
  product: { name: string };
  deliveredAt: string | null;
  createdAt: string;
};

export default function AdminKeysPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [keys, setKeys] = useState<DeliveryKey[]>([]);
  const [productId, setProductId] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [bulkKeys, setBulkKeys] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    fetch("/api/admin/keys")
      .then((r) => r.json())
      .then((data) => { setKeys(data.keys || []); setProducts(data.products || []); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const addKey = async () => {
    if (!productId || !keyValue.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, value: keyValue.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("تمت إضافة المفتاح");
      setKeyValue("");
      load();
    } catch { toast.error("فشل الإضافة"); }
    finally { setLoading(false); }
  };

  const addBulkKeys = async () => {
    if (!productId || !bulkKeys.trim()) return;
    setLoading(true);
    const values = bulkKeys.split("\n").filter(Boolean);
    try {
      let success = 0;
      for (const v of values) {
        const res = await fetch("/api/admin/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, value: v.trim() }),
        });
        if (res.ok) success++;
      }
      toast.success(`تمت إضافة ${success} مفتاح`);
      setBulkKeys("");
      load();
    } catch { toast.error("فشل الإضافة"); }
    finally { setLoading(false); }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("حذف هذا المفتاح؟")) return;
    try {
      await fetch(`/api/admin/keys?id=${id}`, { method: "DELETE" });
      toast.success("تم الحذف");
      load();
    } catch { toast.error("فشل الحذف"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة المفاتيح</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold mb-3">إضافة مفتاح واحد</h3>
          <div className="space-y-3">
            <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">اختر المنتج</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input className="input" value={keyValue} onChange={(e) => setKeyValue(e.target.value)} placeholder="المفتاح / الحساب" />
            <button onClick={addKey} className="btn btn-primary btn-sm w-full" disabled={loading}>
              <Plus size={14} /> إضافة
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">إضافة عدة مفاتيح</h3>
          <div className="space-y-3">
            <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">اختر المنتج</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <textarea className="input min-h-[120px]" value={bulkKeys} onChange={(e) => setBulkKeys(e.target.value)} placeholder="مفتاح 1&#10;مفتاح 2&#10;مفتاح 3" />
            <button onClick={addBulkKeys} className="btn btn-primary btn-sm w-full" disabled={loading}>
              <Plus size={14} /> إضافة الكل
            </button>
          </div>
        </div>
      </div>

      <h2 className="font-semibold mb-3">جميع المفاتيح ({keys.length})</h2>
      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-mono text-xs truncate">{key.value}</span>
                <span className="text-[var(--muted)] text-xs">{key.product.name}</span>
                {key.isUsed ? (
                  <span className="badge badge-red">مستخدم</span>
                ) : (
                  <span className="badge badge-green">جديد</span>
                )}
              </div>
              {!key.isUsed && (
                <button onClick={() => deleteKey(key.id)} className="btn btn-ghost btn-sm text-[var(--danger)]">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {keys.length === 0 && <div className="text-center py-8 text-[var(--muted)]">لا توجد مفاتيح</div>}
        </div>
      </div>
    </div>
  );
}
