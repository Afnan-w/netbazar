"use client";

import { useActionState, useEffect, useState } from "react";
import { saveCategory } from "@/app/admin/(dashboard)/categories/actions";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils/slug";
import { idleActionResult } from "@/types/actions";
import type { Category } from "@/types/database";

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
        <Field label="Name" htmlFor={`category-name-${category?.id ?? "new"}`}>
          <Input
            id={`category-name-${category?.id ?? "new"}`}
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            required
            placeholder="e.g. Phone accessories"
          />
        </Field>
      </div>
      <div className="sm:min-w-48 sm:flex-1">
        <Field label="Slug" htmlFor={`category-slug-${category?.id ?? "new"}`}>
          <Input
            id={`category-slug-${category?.id ?? "new"}`}
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
            placeholder="phone-accessories"
          />
        </Field>
      </div>
      <div className="sm:w-24">
        <Field label="Order" htmlFor={`category-order-${category?.id ?? "new"}`}>
          <Input
            id={`category-order-${category?.id ?? "new"}`}
            name="sort_order"
            type="number"
            min={0}
            max={9999}
            defaultValue={category?.sort_order ?? 0}
          />
        </Field>
      </div>
      <Button type="submit" className="shrink-0 sm:mb-0" pill>
        {category ? "Save" : "Add category"}
      </Button>
    </form>
  );
}
