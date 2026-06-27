import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import ReviewSection from "@/components/ReviewSection";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isVisible) notFound();

  const features: string[] = JSON.parse(product.features || "[]");

  const statusColor = {
    IN_STOCK: "badge-green",
    OUT_OF_STOCK: "badge-red",
    LIMITED: "badge-yellow",
  }[product.status];

  const statusText = {
    IN_STOCK: "متوفر",
    OUT_OF_STOCK: "نفد من المخزون",
    LIMITED: "كمية محدودة",
  }[product.status];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-7xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-elevated)]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            "🎮"
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-[var(--text-muted)]">
              {product.category.icon} {product.category.name}
            </span>
            <span className={`badge ${statusColor}`}>{statusText}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {features.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/10">
              <h3 className="font-semibold mb-3 text-sm">المميزات:</h3>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    <CheckCircle size={15} className="text-[var(--accent)] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="price price-lg">
                {product.priceIQD.toLocaleString()} د.ع
              </span>
            </div>

            <AddToCartButton
              productId={product.id}
              name={product.name}
              priceIQD={product.priceIQD}
              image={product.image}
              slug={product.slug}
              disabled={product.status === "OUT_OF_STOCK"}
            />

            <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                توصيل فوري بعد الدفع
              </div>
              <span className="opacity-30">|</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                ضمان الجودة
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />
      <ReviewSection slug={product.slug} />
    </div>
  );
}
