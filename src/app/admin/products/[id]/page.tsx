"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
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
    isVisible: true,
    features: "",
    image: null as File | null,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`/api/admin/products?id=${params.id}`).then((r) => r.json()),
    ]).then(([cats, product]) => {
      setCategories(cats);
      if (product) {
        setForm({
          name: product.name,
          description: product.description || "",
          priceIQD: String(product.priceIQD),
          categoryId: product.categoryId,
          status: product.status,
          type: product.type,
          isVisible: product.isVisible,
          features: (product.features || []).join("\n"),
          image: null,
        });
      }
    }).catch(() => toast.error("فشل تحميل بيانات المنتج"));
  }, [params.id]);

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

      const body: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        priceIQD: parseFloat(form.priceIQD),
        categoryId: form.categoryId,
        status: form.status,
        type: form.type,
        isVisible: form.isVisible,
        features: form.features.split("\n").filter(Boolean),
      };
      if (imageUrl) body.image = imageUrl;

      const res = await fetch(`/api/admin/products?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("فشل التحديث");

      toast.success("تم تحديث المنتج");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("تم حذف المنتج");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("فشل الحذف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">تعديل المنتج</h1>
        <button onClick={handleDelete} className="btn btn-danger btn-sm">
          <Trash2 size={14} /> حذف
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">اسم المنتج</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">الوصف</label>
            <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">السعر (IQD)</label>
            <input type="number" className="input" value={form.priceIQD} onChange={(e) => setForm({ ...form, priceIQD: e.target.value })} required min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">القسم</label>
            <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">اختر القسم</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الحالة</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="IN_STOCK">متوفر</option>
              <option value="LIMITED">محدود</option>
              <option value="OUT_OF_STOCK">نفد</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">النوع</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="KEY">مفتاح تفعيل</option>
              <option value="ACCOUNT">حساب جاهز</option>
              <option value="SUBSCRIPTION">اشتراك</option>
              <option value="SERVICE">خدمة</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} className="accent-[var(--primary)]" />
              ظاهر في المتجر
            </label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">المميزات</label>
            <textarea className="input min-h-[80px]" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">تغيير الصورة</label>
            <input type="file" accept="image/*" className="input" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn btn-outline flex-1">إلغاء</button>
          <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
