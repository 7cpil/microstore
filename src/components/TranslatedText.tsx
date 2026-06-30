"use client";

import { useLang } from "@/lib/LanguageContext";

export default function TranslatedText({
  ar,
  ku,
  fallback,
}: {
  ar: string;
  ku?: string | null;
  fallback?: string;
}) {
  const { lang } = useLang();

  if (lang === "ku" && ku) return <>{ku}</>;
  return <>{ar || fallback || ""}</>;
}
