"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { toast } from "sonner";
import { useT } from "@/components/T";
import TranslatedText from "@/components/TranslatedText";
import { ArrowLeft, CreditCard, Upload, ShieldCheck, Package, CheckCircle, ChevronLeft, Camera, Music, Send, ThumbsUp, Mail } from "lucide-react";

const platforms = [
  { key: "instagram", icon: Camera, label: "checkout.instagram" },
  { key: "tiktok", icon: Music, label: "checkout.tiktok" },
  { key: "telegram", icon: Send, label: "checkout.telegram" },
  { key: "facebook", icon: ThumbsUp, label: "checkout.facebook" },
];

export default function CheckoutPage() {
  const t = useT();
  const { items, totalIQD, clearCart } = useCart();
  const { convert } = useCurrency();
  const [method, setMethod] = useState<"email" | "social">("email");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState<string>("");
  const [socialHandle, setSocialHandle] = useState("");
  const [contactInfo, setContactInfo] = useState({
    contact_discord: "https://discord.gg/DjkMF3dcZ",
    contact_whatsapp: "07721830415",
    contact_whatsapp2: "07731521412",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.contact_discord) setContactInfo({
          contact_discord: data.contact_discord,
          contact_whatsapp: data.contact_whatsapp || "",
          contact_whatsapp2: data.contact_whatsapp2 || "",
        });
      })
      .catch(() => {});
  }, []);

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center">
          <Package size={40} className="text-[var(--accent)]" />
        </div>
        <p className="text-lg text-[var(--text-muted)] mb-6">{t("cart.empty")}</p>
        <a href="/store" className="btn btn-primary btn-lg">{t("cart.startShopping")}</a>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--success-bg)] flex items-center justify-center animate-fade-in-up">
          <ShieldCheck size={44} className="text-[var(--success)]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("checkout.success")}</h1>
        <p className="text-[var(--text-muted)] mb-4 leading-relaxed">
          {t("checkout.successDesc")}
        </p>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          {t("checkout.myOrders")}
        </p>
        <div className="flex gap-3 justify-center">
          <a href="/orders" className="btn btn-primary">{t("checkout.myOrders")}</a>
          <a href="/store" className="btn btn-outline">{t("checkout.continue")}</a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receipt) {
      toast.error(t("checkout.receiptRequired"));
      return;
    }
    if (method === "social" && (!socialPlatform || !socialHandle.trim())) {
      toast.error(t("checkout.choosePlatform"));
      return;
    }

    setLoading(true);

    try {
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });

      const receiptImage = await toBase64(receipt);

      const body: Record<string, unknown> = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          priceIQD: i.priceIQD,
        })),
        totalIQD,
        paymentMethod: method,
        receiptImage,
        note,
      };

      if (method === "social") {
        body.socialPlatform = socialPlatform;
        body.socialHandle = socialHandle;
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "فشل إنشاء الطلب");
      }

      clearCart();
      setOrderCreated(true);
      toast.success(t("checkout.success"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("error");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">{t("checkout.title")}</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="card space-y-6">
              <div>
                <h2 className="font-semibold flex items-center gap-2 mb-4">
                  <CreditCard size={18} />
                  {t("checkout.deliveryMethod")}
                </h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] cursor-pointer transition-all duration-200 hover:border-[var(--accent)]/50 has-checked:border-[var(--accent)] has-checked:bg-[var(--accent-subtle)]">
                    <input
                      type="radio"
                      name="method"
                      value="email"
                      checked={method === "email"}
                      onChange={() => setMethod("email")}
                      className="accent-[var(--accent)]"
                    />
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-lg">
                      <Mail size={18} className="text-[var(--accent)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t("checkout.email")}</div>
                      <div className="text-xs text-[var(--text-muted)]">{t("checkout.emailDesc")}</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] cursor-pointer transition-all duration-200 hover:border-[var(--accent)]/50 has-checked:border-[var(--accent)] has-checked:bg-[var(--accent-subtle)]">
                    <input
                      type="radio"
                      name="method"
                      value="social"
                      checked={method === "social"}
                      onChange={() => setMethod("social")}
                      className="accent-[var(--accent)]"
                    />
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-lg">
                      🌐
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t("checkout.social")}</div>
                      <div className="text-xs text-[var(--text-muted)]">{t("checkout.socialDesc")}</div>
                    </div>
                  </label>
                </div>
              </div>

              {method === "social" && (
                <div>
                  <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-5 space-y-4">
                    <h3 className="font-semibold text-sm">{t("checkout.choosePlatform")}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {platforms.map((p) => {
                        const Icon = p.icon;
                        const isActive = socialPlatform === p.key;
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => setSocialPlatform(p.key)}
                            className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm border transition-all duration-200 ${
                              isActive
                                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50"
                            }`}
                          >
                            <Icon size={16} />
                            {t(p.label)}
                          </button>
                        );
                      })}
                    </div>
                    {socialPlatform && (
                      <div>
                        <label className="block text-sm font-medium mb-1.5">{t("checkout.socialHandle")}</label>
                        <input
                          type="text"
                          value={socialHandle}
                          onChange={(e) => setSocialHandle(e.target.value)}
                          className="input"
                          placeholder={t("checkout.socialPlaceholder")}
                          dir="ltr"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                   <span>{t("checkout.steps")}</span>
                </h3>
                <ol className="text-sm text-[var(--text-muted)] space-y-3">
                  {[
                    t("checkout.step2"),
                    t("checkout.step3"),
                    t("checkout.step4"),
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 pt-4 border-t border-amber-500/10 text-xs text-[var(--text-muted)]">
                  للاستفسار:{" "}
                   <a href={contactInfo.contact_discord} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{t("checkout.discord")}</a>
                  {contactInfo.contact_whatsapp && (
                    <> | <a href={`https://wa.me/${contactInfo.contact_whatsapp.replace(/^0+/, "964")}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{t("checkout.whatsapp")}: {contactInfo.contact_whatsapp}</a></>
                  )}
                  {contactInfo.contact_whatsapp2 && (
                    <> | <a href={`https://wa.me/${contactInfo.contact_whatsapp2.replace(/^0+/, "964")}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{t("checkout.whatsapp")}: {contactInfo.contact_whatsapp2}</a></>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-1.5">
                  <Upload size={16} />
                  {t("checkout.uploadReceipt")}
                  <span className="text-[var(--text-muted)] font-normal">({t("checkout.uploadHint")})</span>
                </label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--accent)]/50 transition-colors cursor-pointer">
                  {receiptPreview ? (
                    <div className="relative">
                      <img src={receiptPreview} alt="الإيصال" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                      <button
                        type="button"
                        onClick={() => { setReceipt(null); setReceiptPreview(null); }}
                        className="mt-3 text-xs text-[var(--danger)] hover:underline bg-[var(--bg-card)] px-3 py-1 rounded-lg"
                      >
                         {t("cart.remove")}
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setReceipt(file);
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        required
                      />
                      <Upload size={36} className="mx-auto mb-3 text-[var(--text-muted)]" />
                      <span className="text-sm font-medium text-[var(--accent)]">{t("checkout.uploadReceipt")}</span>
                      <p className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG</p>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("checkout.note")} <span className="text-[var(--text-muted)] font-normal">({t("checkout.noteHint")})</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input"
                  placeholder="أي شيء تريد إضافته..."
                />
              </div>

              <button type="submit" className="btn btn-primary w-full text-base py-3" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("checkout.submitting")}
                  </span>
                ) : (
                  t("checkout.submit")
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <Package size={16} />
              {t("checkout.orderSummary")}
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      "🎮"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate"><TranslatedText ar={item.name} ku={item.nameKu} /></div>
                    <div className="text-[10px] text-[var(--text-muted)]">{t("orders.quantity")}: {item.quantity}</div>
                  </div>
                  <div className="text-xs font-medium text-[var(--accent)]">{convert(item.priceIQD * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-sm font-bold">{t("orders.total")}</span>
              <span className="text-base font-extrabold price">{convert(totalIQD)}</span>
            </div>
          </div>

          <div className="card !p-4 text-xs text-[var(--text-muted)]">
            <h4 className="font-semibold mb-3 flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
              <CheckCircle size={14} />
              {t("orders.detail")}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                {method === "email" ? "الاستلام عبر البريد الإلكتروني" : `${t("checkout.social")} (${socialPlatform || "..."})`}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                الدفع عبر آسيا سيل + رفع الإيصال
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                متابعة الطلب من صفحة الطلبات
              </li>
            </ul>
          </div>

          <a href="/cart" className="btn btn-outline w-full text-sm">
            <ChevronLeft size={14} />
            {t("cart.startShopping")}
          </a>
        </div>
      </div>
    </div>
  );
}