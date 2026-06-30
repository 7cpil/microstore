"use client";

import { useLang } from "@/lib/LanguageContext";
import { CheckCircle } from "lucide-react";

export default function FeaturesList({
  features,
  featuresKu,
}: {
  features: string[];
  featuresKu?: string[] | null;
}) {
  const { lang } = useLang();
  const list = lang === "ku" && featuresKu ? featuresKu : features;

  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm">{lang === "ku" ? "تایبەتمەندییەکان" : "المميزات"}</h3>
      <ul className="space-y-2">
        {list.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <CheckCircle size={16} className="mt-0.5 text-[var(--success)] flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
