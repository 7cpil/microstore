"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string | null }[]
  >([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    priceIQD: "",
    categoryId: "",
    status: "IN_STOCK",
    type: "KEY",
    features: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (form.image) {
        const fd = new FormData();
        fd.append("file", form.image);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          priceIQD: parseFloat(form.priceIQD),
          categoryId: form.categoryId,
          status: form.status,
          type: form.type,
          features: form.features.split("\n").filter(Boolean),
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("فشل الإضافة");

      toast.success("تمت إضافة المنتج");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">اسم المنتج</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">الوصف</label>
            <textarea
              className="input min-h-[80px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">السعر (IQD)</label>
            <input
              type="number"
              className="input"
              value={form.priceIQD}
              onChange={(e) => setForm({ ...form, priceIQD: e.target.value })}
              required
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">القسم</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">اختر القسم</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الحالة</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="IN_STOCK">متوفر</option>
              <option value="LIMITED">محدود</option>
              <option value="OUT_OF_STOCK">نفد</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">النوع</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="KEY">مفتاح تفعيل</option>
              <option value="ACCOUNT">حساب جاهز</option>
              <option value="SUBSCRIPTION">اشتراك</option>
              <option value="SERVICE">خدمة</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">
              المميزات (كل سطر = ميزة)
            </label>
            <textarea
              className="input min-h-[80px]"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">صورة المنتج</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files?.[0] || null })
              }
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline flex-1"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : "حفظ المنتج"}
          </button>
        </div>
      </form>
    </div>
  );
}
