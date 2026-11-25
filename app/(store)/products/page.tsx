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
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Catalogue
        </p>
        <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
          All products
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          Browse hand-picked listings. Confirm availability, final price, shipping
          and delivery time on WhatsApp before payment.
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink/20 bg-canvas/60 px-6 py-16 text-center">
              <PackageSearch aria-hidden="true" className="h-10 w-10 text-brand" />
              <h2 className="mt-5 text-xl font-light">Nothing matched your search</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                Try different filters, or tell us what you need and we will check
                whether we can source it.
              </p>
              <Link
                href="/request"
                className="mt-6 rounded-full border border-brand px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-mint"
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
