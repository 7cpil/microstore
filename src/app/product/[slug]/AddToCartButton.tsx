"use client";

import { useCart } from "@/lib/CartContext";
import { ShoppingCart } from "lucide-react";

type Props = {
  productId: string;
  name: string;
  priceIQD: number;
  image: string | null;
  slug: string;
  disabled: boolean;
};

export default function AddToCartButton({
  productId,
  name,
  priceIQD,
  image,
  slug,
  disabled,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem({ productId, name, priceIQD, image, slug })}
      disabled={disabled}
      className="btn btn-primary w-full text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart size={20} />
      {disabled ? "غير متوفر" : "أضف إلى السلة"}
    </button>
  );
}
