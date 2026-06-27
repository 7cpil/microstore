"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";

export type CartItem = {
  productId: string;
  name: string;
  priceIQD: number;
  image?: string | null;
  quantity: number;
  slug: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalIQD: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalIQD: 0,
  itemCount: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        toast.success(`تم تحديث كمية "${item.name}"`, { icon: "🛒" });
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`تمت إضافة "${item.name}" إلى السلة`, { icon: "🛍️" });
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    toast.success("تمت الإزالة من السلة", { icon: "🗑️" });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const totalIQD = items.reduce((sum, i) => sum + i.priceIQD * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalIQD, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
