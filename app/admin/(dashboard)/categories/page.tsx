import { ChevronDown, FolderTree, Trash2 } from "lucide-react";
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

      <section className="nova-panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-primary-tint text-primary">
            <FolderTree aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="text-base font-bold text-ink">Add a category</h2>
        </div>
        <div className="mt-5">
          <CategoryForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold text-ink">Existing categories</h2>
        {categories.length === 0 ? (
          <div className="nova-panel mt-4 px-6 py-12 text-center">
            <p className="text-sm text-secondary-ink">No categories yet.</p>
            <p className="mt-1 text-xs text-muted">
              Add one above to organise the catalogue.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="nova-card nova-lift p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      /{category.slug} · order {category.sort_order}
                    </p>
                  </div>
                  <ConfirmButton
                    action={deleteCategory.bind(null, category.id)}
                    confirmMessage={`Delete ${category.name}? Products must be moved out of it first.`}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-border text-secondary-ink transition-colors hover:bg-blush hover:text-sale"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </ConfirmButton>
                </div>
                <details className="group mt-4 border-t border-border pt-4">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-control px-2 text-sm font-medium text-primary hover:bg-primary-tint [&::-webkit-details-marker]:hidden">
                    Edit details
                    <ChevronDown
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div className="mt-4 rounded-card border border-border bg-page/50 p-4">
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
