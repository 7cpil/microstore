import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Price from "@/components/Price";
import T from "@/components/T";
import TranslatedText from "@/components/TranslatedText";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2"><T k="store.title" /></h1>
        <p className="text-[var(--text-muted)]"><T k="store.desc" /></p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/store" className="btn btn-primary btn-sm">
          <T k="nav.all" />
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/store/${cat.slug}`}
            className="btn btn-outline btn-sm"
          >
            {cat.icon} <TranslatedText ar={cat.name} ku={cat.nameKu} />
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-[var(--text-muted)]"><T k="store.empty" /></p>
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
              <div className="text-xs text-[var(--text-muted)] mb-1">
                {product.category.icon} <TranslatedText ar={product.category.name} ku={product.category.nameKu} />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors leading-snug">
                <TranslatedText ar={product.name} ku={product.nameKu} />
              </h3>
              {product.description && (
                <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
                  <TranslatedText ar={product.description} ku={product.descriptionKu} />
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
