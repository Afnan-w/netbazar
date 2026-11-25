"use client";

import { useActionState, useEffect, useState } from "react";
import { saveCategory } from "@/app/admin/(dashboard)/categories/actions";
import { useToast } from "@/components/admin/toast";
import { slugify } from "@/lib/utils/slug";
import { idleActionResult } from "@/types/actions";
import type { Category } from "@/types/database";

const inputClass =
  "mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm outline-none focus:border-brand";

export function CategoryForm({ category }: { category?: Category }) {
  const [state, formAction] = useActionState(saveCategory, idleActionResult);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const { show } = useToast();

  useEffect(() => {
    if (!state.message) return;
    show(state.message, state.ok ? "success" : "error");
  }, [state, show]);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="sm:min-w-48 sm:flex-1">
        <label htmlFor={`category-name-${category?.id ?? "new"}`} className="text-xs font-medium text-ink/60">
          Name
        </label>
        <input
          id={`category-name-${category?.id ?? "new"}`}
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          required
          placeholder="e.g. Phone accessories"
          className={inputClass}
        />
      </div>
      <div className="sm:min-w-48 sm:flex-1">
        <label htmlFor={`category-slug-${category?.id ?? "new"}`} className="text-xs font-medium text-ink/60">
          Slug
        </label>
        <input
          id={`category-slug-${category?.id ?? "new"}`}
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          required
          placeholder="phone-accessories"
          className={inputClass}
        />
      </div>
      <div className="sm:w-24">
        <label htmlFor={`category-order-${category?.id ?? "new"}`} className="text-xs font-medium text-ink/60">
          Order
        </label>
        <input
          id={`category-order-${category?.id ?? "new"}`}
          name="sort_order"
          type="number"
          min={0}
          max={9999}
          defaultValue={category?.sort_order ?? 0}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="h-[38px] shrink-0 rounded-full border border-brand bg-brand px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {category ? "Save" : "Add category"}
      </button>
    </form>
  );
}
