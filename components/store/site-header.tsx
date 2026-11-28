"use client";

import {
  ArrowRight,
  Compass,
  Cpu,
  Gamepad2,
  Gift,
  Grid2X2,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Shirt,
  Smartphone,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const quickLinks = [
  { href: "/products", label: "What we source" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/wishlist", label: "Saved examples" },
];

function SearchForm({
  suggestions,
  onNavigate,
}: {
  suggestions: SearchSuggestion[];
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();

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
    <form
      action="/products"
      method="get"
      role="search"
      onSubmit={onNavigate}
      className="w-full"
    >
      <label htmlFor="header-search" className="sr-only">
        Search sourcing examples
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
        <div className="flex min-h-12 items-center gap-2 rounded-control border border-border bg-page/70 px-3.5 transition-colors duration-200 focus-within:border-primary focus-within:bg-surface focus-within:shadow-card">
          <input
            id="header-search"
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
                onNavigate?.();
                router.push(
                  `/products?q=${encodeURIComponent(matches[activeIndex].name)}`,
                );
                setOpen(false);
                setActiveIndex(-1);
              }
            }}
            placeholder="Search example items..."
            autoComplete="off"
            autoFocus
            role="combobox"
            aria-expanded={open}
            aria-controls="header-search-suggestions"
            aria-autocomplete="list"
            className="w-full min-h-12 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        </div>

        {open && matches.length > 0 && (
          <div
            id="header-search-suggestions"
            className="dropdown-pop absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-card border border-border bg-surface/95 p-2 shadow-card-hover backdrop-blur-xl"
          >
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted">
              {query ? "Example items" : "Recently sourced examples"}
            </p>
            {matches.map((item, index) => (
              <Link
                key={item.slug}
                href={`/products?q=${encodeURIComponent(item.name)}`}
                onClick={() => {
                  onNavigate?.();
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
                See all examples for “{query}”
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

export function SiteHeader({
  categories,
  suggestions,
  whatsappUrl,
  email,
}: {
  categories: HeaderCategory[];
  suggestions: SearchSuggestion[];
  whatsappUrl: string;
  email: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-200 ${
        scrolled
          ? "border-border/70 bg-surface/90 shadow-card"
          : "border-border bg-surface/95"
      }`}
    >
      <div className="safe-x mx-auto flex h-16 max-w-7xl items-center gap-3 sm:h-[68px]">
        <Link
          href="/"
          onClick={() => {
            setMenuOpen(false);
            setSearchOpen(false);
          }}
          className="shrink-0 text-xl font-semibold tracking-tight text-ink transition-colors duration-200 hover:text-primary"
        >
          Net<span className="text-primary">bazar</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-4 hidden items-center gap-1 lg:flex">
          {quickLinks.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              className={`inline-flex min-h-11 items-center rounded-control px-3 text-sm transition-colors duration-200 hover:bg-primary-tint hover:text-primary ${
                pathname === link.href ? "font-medium text-primary" : "text-secondary-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search examples"}
            aria-expanded={searchOpen}
            aria-controls="header-search-panel"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((open) => !open);
            }}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-secondary-ink transition-colors duration-200 hover:border-primary hover:text-primary pressable"
          >
            {searchOpen ? (
              <X aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Search aria-hidden="true" className="h-4 w-4" />
            )}
          </button>

          <Link
            href="/request"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(false);
            }}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 pressable"
          >
            <span className="hidden sm:inline">Request a product</span>
            <span className="sm:hidden">Request</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen((open) => !open);
            }}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-secondary-ink transition-colors duration-200 hover:border-primary hover:text-primary pressable"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div
          id="header-search-panel"
          className="dropdown-pop safe-x border-t border-border bg-surface/95 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-2xl py-4">
            <SearchForm
              suggestions={suggestions}
              onNavigate={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          id="site-menu"
          className="dropdown-pop safe-x border-t border-border bg-surface/95 backdrop-blur-xl"
        >
          <div className="mx-auto grid max-w-7xl gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
            <nav aria-label="Quick links">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Explore
              </h2>
              <div className="mt-3 grid gap-1">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex min-h-11 items-center rounded-control px-2 text-sm text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav aria-label="Example categories">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Example categories
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.slug] ?? Grid2X2;
                  return (
                    <Link
                      key={category.slug}
                      href={`/products?category=${encodeURIComponent(category.slug)}`}
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-page/60 px-3 text-xs text-secondary-ink transition-colors duration-200 hover:border-primary hover:text-primary"
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{category.name}</span>
                    </Link>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted">
                Your item does not need to be listed here.
              </p>
            </nav>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Talk to us
              </h2>
              <div className="mt-3 grid gap-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4 text-primary" />
                  Chat on WhatsApp
                </a>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 text-primary" />
                  {email}
                </a>
                <Link
                  href="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm text-secondary-ink transition-colors duration-200 hover:bg-primary-tint hover:text-primary"
                >
                  <UserRound aria-hidden="true" className="h-4 w-4 text-primary" />
                  Admin sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
