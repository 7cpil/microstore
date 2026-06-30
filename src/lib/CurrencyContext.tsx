"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Currency = "IQD" | "USD" | "SAR";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: { usd: number; sar: number };
  convert: (priceIQD: number) => string;
  symbol: string;
  ready: boolean;
};

const defaults = { usd: 1310, sar: 349 };

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "IQD",
  setCurrency: () => {},
  rates: defaults,
  convert: () => "",
  symbol: " د.ع",
  ready: false,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("IQD");
  const [rates, setRates] = useState(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency | null;
    if (saved) setCurrency(saved);

    const cached = localStorage.getItem("currency_rates");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < 3600000) {
          setRates({ usd: parsed.usd || defaults.usd, sar: parsed.sar || defaults.sar });
          setReady(true);
          return;
        }
      } catch {}
    }

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const usd = parseFloat(data.usd_rate) || defaults.usd;
        const sar = parseFloat(data.sar_rate) || defaults.sar;
        setRates({ usd, sar });
        setReady(true);
        localStorage.setItem("currency_rates", JSON.stringify({ usd, sar, ts: Date.now() }));
      })
      .catch(() => setReady(true));
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem("currency", c);
  };

  const symbol = currency === "IQD" ? " د.ع" : currency === "SAR" ? " ر.س" : " $";
  const rate = currency === "IQD" ? 1 : currency === "SAR" ? rates.sar : rates.usd;

  const convert = (priceIQD: number) => {
    const val = priceIQD / rate;
    return currency === "IQD"
      ? `${Math.round(val).toLocaleString()}${symbol}`
      : `${val.toFixed(2)}${symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, rates, convert, symbol, ready }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
