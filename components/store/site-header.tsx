"use client";

import { Menu, MessageCircle, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type HeaderCategory = {
  name: string;
  slug: string;
};

const primaryLinks = [
  { href: "/products", label: "Shop" },
  { href: "/request", label: "Request" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function SearchForm({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/products" method="get" role="search" className="w-full">
      <label htmlFor={compact ? "mobile-search" : "header-search"} className="sr-only">
        Search products
      </label>
      <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-3.5 py-2 transition-colors focus-within:border-brand">
        <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink/45" />
        <input
          id={compact ? "mobile-search" : "header-search"}
          name="q"
          type="search"
          placeholder="Search products or SKU"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
        />
      </div>
    </form>
  );
}

export function SiteHeader({
  categories,
  whatsappUrl,
}: {
  categories: HeaderCategory[];
  whatsappUrl: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          net<span className="text-brand">bazar</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-brand ${
                pathname === link.href ? "font-medium text-brand" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-64 md:block xl:w-80">
          <SearchForm />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-[0_12px_28px_-16px_rgba(22,168,120,0.9)] transition-opacity hover:opacity-90 md:ml-0"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-ink/10 bg-surface lg:hidden">
          <div className="space-y-5 px-4 py-5 sm:px-6">
            <SearchForm compact />
            <nav aria-label="Mobile navigation" className="grid gap-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-ink/75 hover:bg-canvas hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div>
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-ink/40">
                Categories
              </p>
              <nav aria-label="Mobile categories" className="grid gap-1">
                <Link
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-ink/75 hover:bg-canvas hover:text-brand"
                >
                  All products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm text-ink/75 hover:bg-canvas hover:text-brand"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
