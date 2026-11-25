import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type {
  AvailabilityFilter,
  ProductSort,
  ShippingFilter,
} from "@/lib/data/store";
import type { Category } from "@/types/database";

export type ProductView = "grid" | "list";

export type ProductFilterValues = {
  search: string;
  category: string;
  availability: AvailabilityFilter;
  sort: ProductSort;
  minPrice: string;
  maxPrice: string;
  shippingTime: ShippingFilter;
  view: ProductView;
};

const fieldClass =
  "w-full rounded-lg border border-line bg-canvas/60 px-3 py-2 text-sm outline-none transition-colors focus:border-brand focus:bg-surface focus:ring-2 focus:ring-brand/15";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-widest text-muted";

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
      <input type="hidden" name="view" value={values.view} />

      <div>
        <label htmlFor={`${idPrefix}-search`} className={labelClass}>
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
        <label htmlFor={`${idPrefix}-category`} className={labelClass}>
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
        <p className={labelClass}>Price range (BDT)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            id={`${idPrefix}-min`}
            name="min"
            type="number"
            min={0}
            defaultValue={values.minPrice}
            placeholder="Min"
            className={fieldClass}
          />
          <input
            id={`${idPrefix}-max`}
            name="max"
            type="number"
            min={0}
            defaultValue={values.maxPrice}
            placeholder="Max"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-availability`} className={labelClass}>
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
        <label htmlFor={`${idPrefix}-shipping`} className={labelClass}>
          Delivery estimate
        </label>
        <select
          id={`${idPrefix}-shipping`}
          name="shipping"
          defaultValue={values.shippingTime}
          className={fieldClass}
        >
          <option value="all">Any delivery time</option>
          <option value="fast">Fast · 7 days or less</option>
          <option value="standard">Standard · 12 days or less</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-sort`} className={labelClass}>
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
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a7055]"
        >
          Apply filters
        </button>
        <Link href="/products" className="text-sm text-muted hover:text-brand">
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
      <details className="mb-6 rounded-xl premium-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />
          Filters
          <span className="ml-auto text-xs text-muted">Price, category, delivery</span>
        </summary>
        <form action="/products" method="get" className="border-t border-line px-5 py-5">
          <FilterFields values={values} categories={categories} idPrefix="mobile" />
        </form>
      </details>

      <aside aria-label="Product filters" className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
        <form action="/products" method="get" className="rounded-2xl premium-card p-5 shadow-[0_20px_50px_-42px_rgba(8,61,49,0.5)]">
          <div className="mb-5 flex items-center gap-2 border-b border-line pb-4 text-sm font-medium">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />
            Filters
          </div>
          <FilterFields values={values} categories={categories} idPrefix="desktop" />
        </form>
      </aside>
    </>
  );
}
