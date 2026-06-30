"use client";

import { useCurrency } from "@/lib/CurrencyContext";

export default function Price({ priceIQD, className }: { priceIQD: number; className?: string }) {
  const { convert } = useCurrency();
  return <span className={className || ""}>{convert(priceIQD)}</span>;
}
