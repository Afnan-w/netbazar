"use client";

import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Compass,
  Cpu,
  Gamepad2,
  Gift,
  Grid2X2,
  Home,
  Menu,
  MessageCircle,
  Search,
  Shirt,
  Smartphone,
  Sparkles,
  UserRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WishlistLink } from "@/components/store/wishlist-link";

type HeaderCategory = { name: string; slug: string };
type SearchSuggestion = { name: string; slug: string; category?: string };

const categoryIcons: Record<string, LucideIcon> = {
  "phone-accessories": Smartphone,
  "home-and-kitchen": Home,
  fashion: Shirt,
  electronics: Cpu,
  "toys-and-games": Gamepad2,
  "beauty-and-care": Sparkles,
  "outdoor-and-travel": Compass,
  everyday: Gift,
};

const primaryLinks = [
  { href: "/products", label: "Shop" },
  { href: "/request", label: "Request" },
  { href: "/faq", label: "FAQ" },
];

function SearchForm({
  suggestions,
  compact = false,
}: {
  suggestions: SearchSuggestion[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const listId = `${compact ? "mobile" : "desktop"}-search-suggestions`;

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    const pool = term
      ? suggestions.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            item.slug.includes(term) ||
            item.category?.toLowerCase().includes(term),
        )
      : suggestions;
    return pool.slice(0, 5);
  }, [query, suggestions]);

  return (
    <form action="/products" method="get" role="search" className="w-full">
      <label htmlFor={compact ? "mobile-search" : "header-search"} className="sr-only">
        Search products
      </label>
      <div
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
      >
        <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas/70 px-3.5 py-3 transition-colors focus-within:border-brand focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand/15">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
          <input
            id={compact ? "mobile-search" : "header-search"}
            name="q"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                setActiveIndex(-1);
                return;
              }
              if (!open || matches.length === 0) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => (index + 1) % matches.length);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) =>
                  index <= 0 ? matches.length - 1 : index - 1,
                );
              } else if (event.key === "Enter" && activeIndex >= 0) {
                event.preventDefault();
                router.push(
                  `/products?q=${encodeURIComponent(matches[activeIndex].name)}`,
                );
                setOpen(false);
                setActiveIndex(-1);
              }
            }}
            placeholder="Search products, brands and categories..."
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            className="w-full bg-transparent text-sm outline-none placeholder:text-subtle"
          />
        </div>

        {open && matches.length > 0 && (
          <div
            id={listId}
            className="dropdown-pop absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl premium-card p-2"
          >
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-subtle">
              {query ? "Suggestions" : "Popular searches"}
            </p>
            {matches.map((item, index) => (
              <Link
                key={item.slug}
                href={`/products?q=${encodeURIComponent(item.name)}`}
                onClick={() => {
                  setOpen(false);
                  setActiveIndex(-1);
                }}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                  activeIndex === index
                    ? "bg-mint text-brand"
                    : "text-ink/75 hover:bg-canvas hover:text-brand"
                }`}
              >
                <Search aria-hidden="true" className="h-3.5 w-3.5 text-subtle" />
                <span className="truncate">{item.name}</span>
                {item.category && (
                  <span className="ml-auto text-[11px] text-muted">{item.category}</span>
                )}
              </Link>
            ))}
            {query && (
              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-between rounded-lg bg-mint px-3 py-2 text-left text-xs font-semibold text-brand"
              >
                See all results for “{query}”
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

function MegaMenu({ categories }: { categories: HeaderCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mega-menu"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm text-ink/70 transition-colors hover:text-brand"
      >
        Categories
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mega-menu"
          className="dropdown-pop absolute left-0 top-[calc(100%+1rem)] z-50 w-[min(860px,calc(100vw-2rem))] rounded-2xl premium-card p-4"
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Shop by category
            </p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand"
            >
              View all
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] ?? Grid2X2;
              return (
                <Link
                  key={category.slug}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  onClick={() => setOpen(false)}
                  className="group/card flex flex-col gap-3 rounded-xl border border-line bg-canvas/50 p-3 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:bg-mint/60 hover:shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-brand shadow-sm">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-ink group-hover/card:text-brand">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({
  categories,
  suggestions,
  whatsappUrl,
}: {
  categories: HeaderCategory[];
  suggestions: SearchSuggestion[];
  whatsappUrl: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "border-line/70 bg-surface/90 shadow-[0_14px_36px_-28px_rgba(8,61,49,0.55)]"
          : "border-line bg-surface/95"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          Net<span className="text-gold-ink">bazar</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
          <MegaMenu categories={categories} />
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative inline-flex text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:text-brand hover:after:scale-x-100 ${
                pathname === link.href
                  ? "font-medium text-brand after:scale-x-100"
                  : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto hidden w-full max-w-2xl md:block">
          <SearchForm suggestions={suggestions} />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/admin/login"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-brand hover:text-brand sm:inline-flex"
          >
            <UserRound aria-hidden="true" className="h-4 w-4" />
          </Link>
          <div className="hidden md:block">
            <WishlistLink />
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(8,61,49,0.85)] transition-all hover:-translate-y-0.5 hover:bg-[#0a7055] hover:shadow-[0_16px_32px_-14px_rgba(8,61,49,0.9)]"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Order on WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line lg:hidden"
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
      </div>

      <nav aria-label="Category navigation" className="hidden border-t border-line bg-surface lg:block">
        <div className="mx-auto flex h-11 max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-gold-ink hover:bg-mint"
          >
            All Categories
          </Link>
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Grid2X2;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-ink/65 transition-colors hover:bg-canvas hover:text-brand"
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5 text-subtle" />
                {category.name}
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-2 h-4 w-px shrink-0 bg-line" />
          <Link
            href="/products?featured=1"
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-ink/65 hover:bg-canvas hover:text-brand"
          >
            Featured Products
          </Link>
          <Link
            href="/products?sort=newest"
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-ink/65 hover:bg-canvas hover:text-brand"
          >
            New Arrivals
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="dropdown-pop border-t border-line bg-surface lg:hidden"
        >
          <div className="space-y-5 px-4 py-5 sm:px-6">
            <SearchForm suggestions={suggestions} compact />
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-line px-3 py-2 text-sm text-ink/75 hover:border-brand hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-line px-3 py-2 text-sm text-ink/75 hover:border-brand hover:text-brand"
              >
                Wishlist
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-line px-3 py-2 text-sm text-ink/75 hover:border-brand hover:text-brand"
              >
                Account
              </Link>
            </nav>
            <div>
              <p className="pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.slug] ?? Grid2X2;
                  return (
                    <Link
                      key={category.slug}
                      href={`/products?category=${encodeURIComponent(category.slug)}`}
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-ink/75 hover:border-brand hover:text-brand"
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 text-brand" />
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-line pt-4 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1">
                <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-gold-ink" />
                Verified suppliers
              </span>
              <span className="inline-flex items-center gap-1">
                <WalletCards aria-hidden="true" className="h-3.5 w-3.5 text-gold-ink" />
                BDT pricing
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
