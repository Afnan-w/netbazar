"use client";

import { ListChecks, Package, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { saveProduct } from "@/app/admin/(dashboard)/products/actions";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { specificationRows } from "@/lib/utils/specifications";
import { slugify } from "@/lib/utils/slug";
import type { Category, Product } from "@/types/database";
import { idleActionResult } from "@/types/actions";

type SpecRow = { key: string; value: string };

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
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="nova-panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-primary-tint text-primary">
            <Package aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">Product details</h2>
            <p className="mt-0.5 text-xs text-muted">
              The essentials customers see on the product page.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Name" htmlFor="name">
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!slugTouched) setSlug(slugify(event.target.value));
                }}
                required
                placeholder="e.g. Wireless earbuds"
              />
            </Field>
          </div>

          <Field label="Slug" htmlFor="slug" hint="Used in the product URL.">
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              required
            />
          </Field>

          <Field label="SKU" htmlFor="sku">
            <Input
              id="sku"
              name="sku"
              defaultValue={product?.sku ?? ""}
              required
            />
          </Field>

          <Field label="Category" htmlFor="category_id">
            <Select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ""}
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Status" htmlFor="status">
            <Select
              id="status"
              name="status"
              defaultValue={product?.status ?? "draft"}
            >
              <option value="draft">Draft</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </Select>
          </Field>

          <Field label="Price (BDT)" htmlFor="price_bdt">
            <Input
              id="price_bdt"
              name="price_bdt"
              type="number"
              min={1}
              step="1"
              defaultValue={product?.price_bdt ?? ""}
              required
            />
          </Field>

          <Field label="Reference price (BDT, optional)" htmlFor="reference_price_bdt">
            <Input
              id="reference_price_bdt"
              name="reference_price_bdt"
              type="number"
              min={1}
              step="1"
              defaultValue={product?.reference_price_bdt ?? ""}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={product?.description ?? ""}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <label className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-page/60 px-3 text-sm text-secondary-ink">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={product?.is_featured ?? false}
                className="h-4 w-4 rounded-control accent-primary"
              />
              Featured
            </label>
            <label className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-page/60 px-3 text-sm text-secondary-ink">
              <input
                type="checkbox"
                name="is_popular"
                defaultChecked={product?.is_popular ?? false}
                className="h-4 w-4 rounded-control accent-primary"
              />
              Popular
            </label>
          </div>
        </div>
      </section>

      <section className="nova-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-control bg-lilac text-primary">
              <ListChecks aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink">Specifications</h2>
              <p className="mt-0.5 text-xs text-muted">
                Key-value rows shown on the product page.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="soft"
            size="sm"
            pill
            onClick={() => setSpecs((current) => [...current, { key: "", value: "" }])}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add row
          </Button>
        </div>

        {specs.length === 0 ? (
          <div className="mt-5 rounded-card border border-dashed border-border bg-page/50 px-4 py-8 text-center text-sm text-muted">
            No specifications added yet.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  name="spec_key"
                  value={spec.key}
                  onChange={(event) => updateSpec(index, { key: event.target.value })}
                  placeholder="Label (e.g. Material)"
                  aria-label={`Specification ${index + 1} label`}
                />
                <Input
                  name="spec_value"
                  value={spec.value}
                  onChange={(event) => updateSpec(index, { value: event.target.value })}
                  placeholder="Value"
                  aria-label={`Specification ${index + 1} value`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setSpecs((current) => current.filter((_, rowIndex) => rowIndex !== index))
                  }
                  aria-label={`Remove specification ${index + 1}`}
                  className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-control border border-border text-secondary-ink transition-colors hover:bg-blush hover:text-sale"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Button type="submit" size="lg" pill className="min-w-44">
        {product ? "Save product" : "Create product"}
      </Button>
    </form>
  );
}
