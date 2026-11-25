import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { AvailabilityFilter, ProductSort } from "@/lib/data/store";
import type { Category } from "@/types/database";

export type ProductFilterValues = {
  search: string;
  category: string;
  availability: AvailabilityFilter;
  sort: ProductSort;
};

const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-brand";

function FilterFields({
  values,
  categories,
  idPrefix,
}: {
  values: ProductFilterValues;
  categories: Category[];
  idPrefix: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor={`${idPrefix}-search`}
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink/50"
        >
          Search
        </label>
        <input
          id={`${idPrefix}-search`}
          name="q"
          type="search"
          defaultValue={values.search}
          placeholder="Name or SKU"
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-category`}
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink/50"
        >
          Category
        </label>
        <select
          id={`${idPrefix}-category`}
          name="category"
          defaultValue={values.category}
          className={fieldClass}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-availability`}
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink/50"
        >
          Availability
        </label>
        <select
          id={`${idPrefix}-availability`}
          name="availability"
          defaultValue={values.availability}
          className={fieldClass}
        >
          <option value="all">All products</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-sort`}
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink/50"
        >
          Sort by
        </label>
        <select
          id={`${idPrefix}-sort`}
          name="sort"
          defaultValue={values.sort}
          className={fieldClass}
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Apply filters
        </button>
        <Link href="/products" className="text-sm text-ink/55 hover:text-brand">
          Clear
        </Link>
      </div>
    </div>
  );
}

export function ProductFilters({
  values,
  categories,
}: {
  values: ProductFilterValues;
  categories: Category[];
}) {
  return (
    <>
      <details className="mb-6 rounded-3xl border border-ink/10 bg-canvas lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />
          Filters
          <span className="ml-auto text-xs text-ink/45">Search, category, price</span>
        </summary>
        <form action="/products" method="get" className="border-t border-ink/10 px-5 py-5">
          <FilterFields values={values} categories={categories} idPrefix="mobile" />
        </form>
      </details>

      <aside
        aria-label="Product filters"
        className="hidden lg:sticky lg:top-44 lg:block lg:h-fit"
      >
        <div className="rounded-3xl border border-ink/10 bg-canvas p-5">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-semibold">Filters</h2>
          </div>
          <form action="/products" method="get">
            <FilterFields values={values} categories={categories} idPrefix="desktop" />
          </form>
        </div>
      </aside>
    </>
  );
}
