"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/auth/reset-password?token=${data.token}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">نسيت كلمة السر</h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-6">أدخل بريدك الإلكتروني لإعادة تعيين كلمة السر</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                dir="ltr"
                className="input !pr-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "جاري..." : "إرسال"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1">
            <ArrowRight size={14} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
