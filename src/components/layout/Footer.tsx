import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16 bg-[var(--bg-secondary)]/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">MS</span>
              </div>
              <span className="text-lg font-bold gradient-text">Micro Store</span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
              متجر متخصص في بيع المنتجات الرقمية — هاكات، برامج، اشتراكات، وحسابات ألعاب بأسعار تنافسية.
              نوفر لك كل ما تحتاجه في مكان واحد.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">الأقسام</h4>
            <ul className="space-y-2.5">
              <li><Link href="/store/micro" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Micro</Link></li>
              <li><Link href="/store/gaming" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">جيمينج وهاكات</Link></li>
              <li><Link href="/store/software" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">برامج واشتراكات</Link></li>
              <li><Link href="/store/design" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">مونتاج وتصميم</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">التواصل</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://discord.gg/DjkMF3dcZ" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  ديسكورد
                </a>
              </li>
              <li>
                <a href="https://wa.me/9647721830415" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  واتساب: 07721830415
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="divider" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-[var(--text-muted)] pt-1">
          <p>© {new Date().getFullYear()} Micro Store. جميع الحقوق محفوظة.</p>
          <p className="text-xs opacity-60">منتجات رقمية بأسعار تنافسية</p>
        </div>
      </div>
    </footer>
  );
}
