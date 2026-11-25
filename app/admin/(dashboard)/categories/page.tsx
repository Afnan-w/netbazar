import { Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CategoryForm } from "@/components/admin/category-form";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminCategories } from "@/lib/data/admin";
import { deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group products for browsing. Sort order controls how categories appear on the site."
      />

      <section className="rounded-3xl border border-ink/10 bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-medium">Add a category</h2>
        <div className="mt-5">
          <CategoryForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-medium">Existing categories</h2>
        {categories.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-ink/20 bg-surface p-8 text-center text-sm text-ink/55">
            No categories yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="rounded-3xl border border-ink/10 bg-surface p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="mt-0.5 text-xs text-ink/45">
                      /{category.slug} · order {category.sort_order}
                    </p>
                  </div>
                  <ConfirmButton
                    action={deleteCategory.bind(null, category.id)}
                    confirmMessage={`Delete ${category.name}? Products must be moved out of it first.`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 text-ink/55 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </ConfirmButton>
                </div>
                <details className="group mt-4 border-t border-ink/10 pt-4">
                  <summary className="cursor-pointer list-none text-sm text-brand [&::-webkit-details-marker]:hidden">
                    Edit details
                  </summary>
                  <div className="mt-4">
                    <CategoryForm category={category} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
