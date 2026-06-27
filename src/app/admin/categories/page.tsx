"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
  _count: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const addCategory = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, icon: newIcon }),
      });
      if (!res.ok) throw new Error();
      toast.success("تمت إضافة القسم");
      setNewName("");
      setNewIcon("");
      load();
    } catch {
      toast.error("فشل الإضافة");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم الحذف");
      load();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الأقسام</h1>

      <div className="card mb-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5">اسم القسم</label>
            <input
              className="input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="مثلاً: جيمينج"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium mb-1.5">أيقونة</label>
            <input
              className="input"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="🎮"
            />
          </div>
          <button onClick={addCategory} className="btn btn-primary btn-sm !mb-0.5" disabled={loading}>
            <Plus size={16} /> إضافة
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div key={cat.id} className="card flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3">
              <span className="text-[var(--muted)] text-sm">{i + 1}</span>
              <span className="text-xl">{cat.icon || "📦"}</span>
              <div>
                <div className="font-medium text-sm">{cat.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {cat._count.products} منتج · /store/{cat.slug}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">ترتيب: {cat.order}</span>
              <button onClick={() => deleteCategory(cat.id)} className="btn btn-ghost btn-sm text-[var(--danger)]">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-8 text-[var(--muted)] text-sm">
            لا توجد أقسام بعد
          </div>
        )}
      </div>
    </div>
  );
}
