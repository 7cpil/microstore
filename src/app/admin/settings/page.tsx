"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [rates, setRates] = useState({ usd_rate: "1310", sar_rate: "349" });
  const [contact, setContact] = useState({
    contact_discord: "https://discord.gg/DjkMF3dcZ",
    contact_whatsapp: "07721830415",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.usd_rate) setRates({ usd_rate: data.usd_rate, sar_rate: data.sar_rate || "349" });
        if (data.contact_discord) setContact({ contact_discord: data.contact_discord, contact_whatsapp: data.contact_whatsapp || "" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveRates = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rates),
      });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ أسعار الصرف");
    } catch {
      toast.error("فشل الحفظ");
    }
  };

  const handleSaveContact = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ معلومات الاتصال");
    } catch {
      toast.error("فشل الحفظ");
    }
  };

  if (loading) return <div className="text-center py-20 text-[var(--muted)]">جاري التحميل...</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      <div className="card space-y-4">
        <h2 className="font-semibold">أسعار الصرف</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            1 دولار = ? دينار
          </label>
          <input
            type="number"
            className="input"
            value={rates.usd_rate}
            onChange={(e) => setRates({ ...rates, usd_rate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            1 ريال = ? دينار
          </label>
          <input
            type="number"
            className="input"
            value={rates.sar_rate}
            onChange={(e) => setRates({ ...rates, sar_rate: e.target.value })}
          />
        </div>
        <button onClick={handleSaveRates} className="btn btn-primary">
          <Save size={16} /> حفظ أسعار الصرف
        </button>
      </div>

      <div className="card mt-4 space-y-4">
        <h2 className="font-semibold">معلومات الاتصال</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">رابط الديسكورد</label>
          <input
            type="text"
            className="input"
            value={contact.contact_discord}
            onChange={(e) => setContact({ ...contact, contact_discord: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">رقم الواتساب</label>
          <input
            type="text"
            className="input"
            value={contact.contact_whatsapp}
            onChange={(e) => setContact({ ...contact, contact_whatsapp: e.target.value })}
          />
        </div>
        <button onClick={handleSaveContact} className="btn btn-primary">
          <Save size={16} /> حفظ معلومات الاتصال
        </button>
      </div>
    </div>
  );
}
