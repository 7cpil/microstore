"use client";

import { useLang } from "@/lib/LanguageContext";
import TranslatedText from "@/components/TranslatedText";

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-8">
      <div className="max-w-lg rounded-xl bg-[var(--bg-card)] p-8 text-center shadow-[var(--shadow-elevated)]">
        <h1 className="mb-4 text-3xl font-bold text-[var(--text-primary)]">
          {t("notFound.title")}
        </h1>
        <p className="mb-6 text-[var(--text-secondary)]">
          {t("notFound.message")}
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-subtle)] transition-colors"
        >
          {t("notFound.backHome")}
        </a>
      </div>
    </div>
  );
}
