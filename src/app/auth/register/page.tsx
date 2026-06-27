"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      setLoading(false);
    } else {
      toast.success("تم إنشاء الحساب! سجل الدخول الآن");
      router.push("/auth/login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 md:mt-16">
      <div className="card border-[var(--accent)]/10 shadow-[var(--shadow-glow)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <UserPlus size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">انضم إلينا الآن!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">الاسم</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="اسمك"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="•••••••• (6 أحرف على الأقل)"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري إنشاء الحساب...
              </span>
            ) : (
              "إنشاء حساب"
            )}
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-[var(--border)] text-sm text-center">
          <span className="text-[var(--text-muted)]">لديك حساب؟ </span>
          <Link href="/auth/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
