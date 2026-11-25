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
  "soft-input w-full text-sm text-ink placeholder:text-muted transition-colors duration-200 hover:border-primary/30 focus:border-primary focus:outline-none";

const labelClass =
  "mb-2 inline-flex rounded-badge bg-primary-tint px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary";

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

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary px-5 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 active:bg-primary-active pressable"
        >
          Apply filters
        </button>
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-control px-2 text-sm text-secondary-ink transition-colors duration-200 hover:text-primary hover:underline hover:underline-offset-4"
        >
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
      <details className="mb-6 rounded-card border border-border bg-surface shadow-card lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-card px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-primary" />
          Filters
          <span className="ml-auto text-xs font-normal text-muted">Price, category, delivery</span>
        </summary>
        <form action="/products" method="get" className="border-t border-border p-5">
          <FilterFields values={values} categories={categories} idPrefix="mobile" />
        </form>
      </details>

      <aside aria-label="Product filters" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <form action="/products" method="get" className="rounded-card border border-border bg-surface p-5 shadow-card">
          <div className="mb-5 flex items-center gap-2 border-b border-border pb-4 text-sm font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary-tint text-primary">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            </span>
            Filters
          </div>
          <FilterFields values={values} categories={categories} idPrefix="desktop" />
        </form>
      </aside>
    </>
  );
}
