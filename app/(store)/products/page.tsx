import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Pagination } from "@/components/store/pagination";
import { ProductCard } from "@/components/store/product-card";
import {
  ProductFilters,
  type ProductFilterValues,
} from "@/components/store/product-filters";
import {
  getCategories,
  getProducts,
  type AvailabilityFilter,
  type ProductSort,
} from "@/lib/data/store";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse products sourced from China for delivery in Bangladesh.",
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
  };
  const parsedPage = Number.parseInt(firstValue(params.page), 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = 12;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ ...values, page, pageSize }),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));
  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (values.search) query.set("q", values.search);
    if (values.category) query.set("category", values.category);
    if (values.availability !== "all") {
      query.set("availability", values.availability);
    }
    if (values.sort !== "newest") query.set("sort", values.sort);
    if (targetPage > 1) query.set("page", String(targetPage));
    const encoded = query.toString();
    return encoded ? `/products?${encoded}` : "/products";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-ink/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Catalogue</p>
          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">All products</h1>
        </div>
        <p className="max-w-sm text-sm text-ink/50">
          Browse the catalogue. Price and delivery are confirmed on WhatsApp before payment.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters values={values} categories={categories} />

        <div>
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
            <p className="text-sm text-ink/60">
              {result.total === 0
                ? "No products found"
                : `${result.total} product${result.total === 1 ? "" : "s"}`}
            </p>
            <p className="text-xs uppercase tracking-widest text-ink/40">
              Page {page} of {totalPages}
            </p>
          </div>

          {result.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-canvas/40 px-6 py-14 text-center">
              <PackageSearch aria-hidden="true" className="mx-auto h-8 w-8 text-ink/30" />
              <h2 className="mt-4 text-lg font-light">No products found</h2>
              <p className="mt-2 text-sm text-ink/50">Try different filters or request the item.</p>
              <Link href="/request" className="mt-5 inline-flex rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-mint">
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
