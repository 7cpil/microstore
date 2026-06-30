import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { LanguageProvider, useLang } from "@/lib/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "Micro Store — متجر المنتجات الرقمية",
  description: "متجر متخصص في بيع المنتجات الرقمية: هاكات، برامج، اشتراكات، حسابات ألعاب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { lang } = useLang();
  return (
    <html lang={lang} dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartProvider>
                <Navbar />
                <main className="main-content">{children}</main>
                <Footer />
                <Toaster position="top-center" richColors />
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
