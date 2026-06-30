"use client";

import { useLang } from "@/lib/LanguageContext";

export default function T({ k, className }: { k: string; className?: string }) {
  const { t } = useLang();
  return <span className={className}>{t(k)}</span>;
}

export function useT() {
  const { t } = useLang();
  return t;
}
