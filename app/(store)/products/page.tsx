import { LayoutGrid, List, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/store/pagination";
import { ProductCard } from "@/components/store/product-card";
import { ProductRow } from "@/components/store/product-row";
import {
  ProductFilters,
  type ProductFilterValues,
  type ProductView,
} from "@/components/store/product-filters";
import {
  getCategories,
  getProducts,
  getSiteSettings,
  type AvailabilityFilter,
  type ProductSort,
  type ShippingFilter,
} from "@/lib/data/store";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse curated China-to-Bangladesh products with BDT pricing.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parseAvailability(value: string): AvailabilityFilter {
  return value === "available" || value === "unavailable" ? value : "all";
}

function parseSort(value: string): ProductSort {
  return value === "price-asc" || value === "price-desc" ? value : "newest";
}

function parseShipping(value: string): ShippingFilter {
  return value === "fast" || value === "standard" ? value : "all";
}

function parseView(value: string): ProductView {
  return value === "list" ? "list" : "grid";
}

function parseFeatured(value: string): boolean {
  return value === "1";
}

function parsePrice(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const values: ProductFilterValues = {
    search: firstValue(params.q).slice(0, 100),
    category: firstValue(params.category),
    availability: parseAvailability(firstValue(params.availability)),
    sort: parseSort(firstValue(params.sort)),
    minPrice: firstValue(params.min),
    maxPrice: firstValue(params.max),
    shippingTime: parseShipping(firstValue(params.shipping)),
    view: parseView(firstValue(params.view)),
  };
  const featuredOnly = parseFeatured(firstValue(params.featured));
  const parsedPage = Number.parseInt(firstValue(params.page), 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = 12;

  const [categories, result, settings] = await Promise.all([
    getCategories(),
    getProducts({
      search: values.search,
      categorySlug: values.category,
      availability: values.availability,
      sort: values.sort,
      minPrice: parsePrice(values.minPrice),
      maxPrice: parsePrice(values.maxPrice),
      shippingTime: values.shippingTime,
      featured: featuredOnly || undefined,
      page,
      pageSize,
    }),
    getSiteSettings(),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));
  const buildHref = (targetPage: number, view: ProductView = values.view) => {
    const query = new URLSearchParams();
    if (values.search) query.set("q", values.search);
    if (values.category) query.set("category", values.category);
    if (values.availability !== "all") {
      query.set("availability", values.availability);
    }
    if (values.minPrice) query.set("min", values.minPrice);
    if (values.maxPrice) query.set("max", values.maxPrice);
    if (values.shippingTime !== "all") query.set("shipping", values.shippingTime);
    if (values.sort !== "newest") query.set("sort", values.sort);
    if (featuredOnly) query.set("featured", "1");
    if (view !== "grid") query.set("view", view);
    if (targetPage > 1) query.set("page", String(targetPage));
    const encoded = query.toString();
    return encoded ? `/products?${encoded}` : "/products";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {featuredOnly ? "Curated selection" : "Catalogue"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {featuredOnly ? "Featured products" : "All products"}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
              Verified suppliers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck aria-hidden="true" className="h-3.5 w-3.5 text-support" />
              Delivery confirmed before payment
            </span>
          </div>
        </div>
        <p className="max-w-sm text-sm text-muted">
          Price and delivery are confirmed on WhatsApp before you pay.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <ProductFilters values={values} categories={categories} />

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-sm text-muted">
              {result.total === 0
                ? "No products found"
                : `${result.total} product${result.total === 1 ? "" : "s"}`}
              <span className="ml-2 text-ink/35">· Page {page} of {totalPages}</span>
            </p>
            <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-canvas/60 p-1">
              <Link
                href={buildHref(page, "grid")}
                aria-label="Grid view"
                aria-current={values.view === "grid" ? "page" : undefined}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  values.view === "grid"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-accent"
                }`}
              >
                <LayoutGrid aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href={buildHref(page, "list")}
                aria-label="List view"
                aria-current={values.view === "list" ? "page" : undefined}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  values.view === "list"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-accent"
                }`}
              >
                <List aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {result.items.length > 0 ? (
            values.view === "grid" ? (
              <div className="product-grid grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {result.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={settings.whatsapp_number}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {result.items.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    whatsappNumber={settings.whatsapp_number}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-canvas/60 px-6 py-16 text-center">
              <PackageSearch aria-hidden="true" className="mx-auto h-8 w-8 text-accent" />
              <h2 className="mt-4 text-lg font-medium">No products found</h2>
              <p className="mt-2 text-sm text-muted">
                Try different filters or request the item directly.
              </p>
              <Link
                href="/request"
                className="mt-6 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-highlight"
              >
                Request a product
              </Link>
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
