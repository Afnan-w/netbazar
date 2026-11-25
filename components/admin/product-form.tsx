"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { saveProduct } from "@/app/admin/(dashboard)/products/actions";
import { useToast } from "@/components/admin/toast";
import { specificationRows } from "@/lib/utils/specifications";
import { slugify } from "@/lib/utils/slug";
import type { Category, Product } from "@/types/database";
import { idleActionResult } from "@/types/actions";

type SpecRow = { key: string; value: string };

const inputClass =
  "mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const [state, formAction] = useActionState(saveProduct, idleActionResult);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [specs, setSpecs] = useState<SpecRow[]>(
    product ? specificationRows(product.specifications).map(([key, value]) => ({ key, value })) : [],
  );
  const router = useRouter();
  const { show } = useToast();

  useEffect(() => {
    if (!state.message) return;
    show(state.message, state.ok ? "success" : "error");
    if (state.ok && state.redirectTo) router.push(state.redirectTo);
  }, [state, show, router]);

  function updateSpec(index: number, patch: Partial<SpecRow>) {
    setSpecs((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row,
      ),
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-medium">Product details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className="text-sm font-medium">Slug</label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sku" className="text-sm font-medium">SKU</label>
            <input
              id="sku"
              name="sku"
              defaultValue={product?.sku ?? ""}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category_id" className="text-sm font-medium">Category</label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className={inputClass}
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select
              id="status"
              name="status"
              defaultValue={product?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label htmlFor="price_bdt" className="text-sm font-medium">Price (BDT)</label>
            <input
              id="price_bdt"
              name="price_bdt"
              type="number"
              min={1}
              step="1"
              defaultValue={product?.price_bdt ?? ""}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="reference_price_bdt" className="text-sm font-medium">
              Reference price (BDT, optional)
            </label>
            <input
              id="reference_price_bdt"
              name="reference_price_bdt"
              type="number"
              min={1}
              step="1"
              defaultValue={product?.reference_price_bdt ?? ""}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              className={inputClass}
            />
          </div>

          <div className="flex gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={product?.is_featured ?? false}
                className="h-4 w-4 accent-[#0B5C48]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_popular"
                defaultChecked={product?.is_popular ?? false}
                className="h-4 w-4 accent-[#0B5C48]"
              />
              Popular
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">Specifications</h2>
            <p className="mt-1 text-sm text-ink/55">Add key-value rows shown on the product page.</p>
          </div>
          <button
            type="button"
            onClick={() => setSpecs((current) => [...current, { key: "", value: "" }])}
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-3 py-2 text-sm hover:border-brand hover:text-brand"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add row
          </button>
        </div>

        {specs.length === 0 ? (
          <p className="mt-5 text-sm text-ink/50">No specifications added yet.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  name="spec_key"
                  value={spec.key}
                  onChange={(event) => updateSpec(index, { key: event.target.value })}
                  placeholder="Label (e.g. Material)"
                  aria-label={`Specification ${index + 1} label`}
                  className="mt-0 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
                <input
                  name="spec_value"
                  value={spec.value}
                  onChange={(event) => updateSpec(index, { value: event.target.value })}
                  placeholder="Value"
                  aria-label={`Specification ${index + 1} value`}
                  className="mt-0 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSpecs((current) => current.filter((_, rowIndex) => rowIndex !== index))
                  }
                  aria-label={`Remove specification ${index + 1}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-ink/50 hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        type="submit"
        className="rounded-full border border-brand bg-brand px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {product ? "Save product" : "Create product"}
      </button>
    </form>
  );
}
