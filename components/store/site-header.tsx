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
import { ThemeToggle } from "@/components/theme/theme-toggle";
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
        <div className="flex min-h-11 items-center gap-2 rounded-control border border-border bg-page/70 px-3.5 transition-colors duration-200 focus-within:border-primary focus-within:bg-surface focus-within:shadow-card">
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
            className="w-full min-h-11 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        </div>

        {open && matches.length > 0 && (
          <div
            id={listId}
            className="dropdown-pop absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-card border border-border bg-surface/95 p-2 shadow-card-hover backdrop-blur-xl"
          >
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted">
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
                className={`flex min-h-11 items-center gap-2 rounded-control px-2 py-2 text-sm transition-colors duration-200 ${
                  activeIndex === index
                    ? "bg-primary-tint text-primary"
                    : "text-secondary-ink hover:bg-page hover:text-primary"
                }`}
              >
                <Search aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
                <span className="truncate">{item.name}</span>
                {item.category && (
                  <span className="ml-auto text-[11px] text-muted">{item.category}</span>
                )}
              </Link>
            ))}
            {query && (
              <button
                type="submit"
                className="mt-1 flex min-h-11 w-full items-center justify-between rounded-control bg-primary-tint px-3 py-2 text-left text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary/15"
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
        className="inline-flex min-h-11 items-center gap-1 rounded-control px-3 text-sm text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
      >
        Categories
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mega-menu"
          className="dropdown-pop absolute left-0 top-[calc(100%+1rem)] z-50 w-[min(860px,calc(100vw-2rem))] rounded-panel border border-border bg-surface/95 p-4 shadow-card-hover backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Shop by category
            </p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-1 rounded-control px-2 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary-tint"
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
                  className="group/card flex flex-col gap-3 rounded-card border border-border bg-page/60 p-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:bg-primary-tint hover:shadow-card"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-control bg-primary-tint text-primary shadow-card">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-ink transition-colors duration-200 group-hover/card:text-primary">
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
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-200 ${
        scrolled
          ? "border-border/70 bg-surface/90 shadow-card"
          : "border-border bg-surface/95"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-tight text-ink transition-colors duration-200 hover:text-primary"
          onClick={() => setMenuOpen(false)}
        >
          Net<span className="text-primary">bazar</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          <MegaMenu categories={categories} />
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative inline-flex min-h-11 items-center rounded-control px-3 text-sm transition-colors duration-200 after:absolute after:bottom-1 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:text-primary hover:after:scale-x-100 ${
                pathname === link.href
                  ? "font-medium text-primary after:scale-x-100"
                  : "text-secondary-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto hidden w-full max-w-xl md:block">
          <SearchForm suggestions={suggestions} />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="hidden md:block">
            <ThemeToggle compact />
          </div>
          <Link
            href="/admin/login"
            aria-label="Account"
            className="hidden min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card sm:inline-flex"
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
            className="relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 active:bg-primary-active pressable"
          >
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-surface"
            />
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Order on WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card lg:hidden pressable"
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

      <nav aria-label="Category navigation" className="hidden border-t border-border bg-surface/95 lg:block">
        <div className="mx-auto flex h-11 max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary-tint px-4 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary/15"
          >
            All Categories
          </Link>
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Grid2X2;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                {category.name}
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-2 h-4 w-px shrink-0 bg-border" />
          <Link
            href="/products?featured=1"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-xs font-medium text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
          >
            Featured Products
          </Link>
          <Link
            href="/products?sort=newest"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-xs font-medium text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
          >
            New Arrivals
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="dropdown-pop border-t border-border bg-surface/95 backdrop-blur-xl lg:hidden"
        >
          <div className="space-y-5 px-4 py-5 sm:px-6">
            <SearchForm suggestions={suggestions} compact />
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-3 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-3 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary"
              >
                Wishlist
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-3 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary"
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
                      className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-3 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary"
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-card border border-border bg-page/60 p-3">
              <div>
                <p className="text-sm font-medium text-ink">Appearance</p>
                <p className="text-xs text-muted">Switch between light and dark</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1">
                <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                Verified suppliers
              </span>
              <span className="inline-flex items-center gap-1">
                <WalletCards aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                BDT pricing
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
