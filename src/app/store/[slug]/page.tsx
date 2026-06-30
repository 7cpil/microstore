import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Price from "@/components/Price";
import T from "@/components/T";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isVisible: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <Link href="/store" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-3">
          <ArrowRight size={14} />
          <T k="nav.all" />
        </Link>
        <h1 className="text-3xl font-bold">{category.icon} {category.name}</h1>
        <p className="text-[var(--text-muted)] mt-1">{products.length} <T k="home.products" /></p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-[var(--text-muted)]"><T k="store.empty" /></p>
          <Link href="/store" className="btn btn-primary mt-4">
            <T k="home.hero.browse" />
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, i) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className={`card card-hover group animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-5xl mb-4 overflow-hidden relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  "🎮"
                )}
                <div className="absolute top-2 right-2">
                  <span className={`badge ${
                    product.status === "IN_STOCK" ? "badge-green" :
                    product.status === "LIMITED" ? "badge-yellow" : "badge-red"
                  }`}>
                    {product.status === "IN_STOCK" ? <T k="product.inStock" /> :
                     product.status === "LIMITED" ? <T k="product.limited" /> : <T k="product.outOfStock" />}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors leading-snug">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
              <div className="price">
                <Price priceIQD={product.priceIQD} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
