import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(amountIQD: number, currency: "IQD" | "USD" | "SAR" = "IQD"): string {
  const rates = {
    IQD: 1,
    USD: 1310,
    SAR: 349,
  };

  const converted = amountIQD / rates[currency];

  if (currency === "IQD") {
    return `${Math.round(converted).toLocaleString()} د.ع`;
  } else if (currency === "SAR") {
    return `${converted.toFixed(2)} ر.س`;
  }
  return `$${converted.toFixed(2)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
