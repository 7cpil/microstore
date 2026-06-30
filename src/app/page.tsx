import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Price from "@/components/Price";
import T from "@/components/T";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: { where: { isVisible: true } } } } },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { isVisible: true, status: "IN_STOCK" },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const categoryIcons: Record<string, string> = {};
  categories.forEach((c) => { if (c.icon) categoryIcons[c.slug] = c.icon; });

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 via-[var(--bg-secondary)] to-purple-900/10 border border-[var(--border)] mb-12 md:mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent)_0%,_transparent_60%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#7c3aed_0%,_transparent_60%)] opacity-10" />
        <div className="relative px-6 md:px-12 py-12 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/20 text-sm text-[var(--accent)] mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <T k="home.hero.subtitle" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            <T k="home.hero.title" />
            <br />
            <span className="gradient-text"><T k="home.hero.subtitle" /></span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
            <T k="home.hero.desc" />
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/store" className="btn btn-primary btn-lg">
              <T k="home.hero.shop" />
            </Link>
            <Link href="/store" className="btn btn-outline btn-lg">
              <T k="home.hero.browse" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12 md:mb-16">
        <h2 className="section-title"><T k="home.sections" /></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/store/${cat.slug}`}
              className={`card card-hover text-center group animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[var(--accent-subtle)] to-purple-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[cat.slug] || "📦"}
              </div>
              <div className="font-semibold text-sm">{cat.name}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {cat._count.products} <T k="home.products" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title !mb-0"><T k="home.latest" /></h2>
          <Link href="/store" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium">
            <T k="home.viewAll" /> ←
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product, i) => (
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
                {product.category.icon} {product.category.name}
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
      </section>
    </div>
  );
}
