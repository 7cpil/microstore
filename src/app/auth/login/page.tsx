"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
    } else {
      toast.success("تم تسجيل الدخول");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 md:mt-16">
      <div className="card border-[var(--accent)]/10 shadow-[var(--shadow-glow)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <LogIn size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">أهلاً بعودتك!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري تسجيل الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-[var(--border)] text-sm text-center">
          <span className="text-[var(--text-muted)]">ليس لديك حساب؟ </span>
          <Link href="/auth/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  );
}
