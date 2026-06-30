"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("كلمة السر غير متطابقة");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDone(true);
      toast.success("تم تغيير كلمة السر بنجاح");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="card w-full max-w-md p-8 text-center">
          <p className="text-[var(--danger)] mb-4">رمز غير صالح</p>
          <Link href="/auth/forgot-password" className="text-sm text-[var(--accent)] hover:underline">طلب رابط جديد</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="card w-full max-w-md p-8 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-[var(--success)]" />
          <h1 className="text-2xl font-bold mb-2">تم بنجاح</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">تم تغيير كلمة السر. سجل دخولك الآن.</p>
          <Link href="/auth/login" className="btn btn-primary">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">تعيين كلمة سر جديدة</h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-6">أدخل كلمة السر الجديدة</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">كلمة السر الجديدة</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                className="input !pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••"
              />
            </div>
          </div>
          <div>
            <label className="label">تأكيد كلمة السر</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                className="input !pr-10"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                placeholder="••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "جاري..." : "تعيين كلمة السر"}
          </button>
        </form>
      </div>
    </div>
  );
}
