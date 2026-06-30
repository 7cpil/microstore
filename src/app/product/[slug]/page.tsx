import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import ReviewSection from "@/components/ReviewSection";
import Price from "@/components/Price";
import FeaturesList from "@/components/FeaturesList";
import T from "@/components/T";
import TranslatedText from "@/components/TranslatedText";

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
  const featuresKu: string[] | null = product.featuresKu ? JSON.parse(product.featuresKu) : null;

  const statusColor = {
    IN_STOCK: "badge-green",
    OUT_OF_STOCK: "badge-red",
    LIMITED: "badge-yellow",
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
              {product.category.icon} <TranslatedText ar={product.category.name} ku={product.category.nameKu} />
            </span>
            <span className={`badge ${statusColor}`}>
              {product.status === "IN_STOCK" ? <T k="product.inStock" /> :
               product.status === "OUT_OF_STOCK" ? <T k="product.outOfStock" /> :
               <T k="product.limited" />}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            <TranslatedText ar={product.name} ku={product.nameKu} />
          </h1>

          {product.description && (
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              <TranslatedText ar={product.description} ku={product.descriptionKu} />
            </p>
          )}

          {features.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/10">
              <FeaturesList features={features} featuresKu={featuresKu} />
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-6">
              <Price priceIQD={product.priceIQD} className="price price-lg" />
            </div>

            <AddToCartButton
              productId={product.id}
              name={product.name}
              nameKu={product.nameKu}
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
