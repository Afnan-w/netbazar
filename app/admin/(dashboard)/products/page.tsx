import { Copy, PackageSearch, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button, ButtonLink, buttonClass } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminProducts } from "@/lib/data/admin";
import { formatBDT } from "@/lib/utils/format";
import { deleteProduct, duplicateProduct } from "./actions";

type ProductsPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (raw ?? "").trim().slice(0, 100);
  const products = await getAdminProducts(query);

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the example items shown to customers. Your supplier can source much more than this list."
        action={
          <ButtonLink href="/admin/products/new" pill>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New product
          </ButtonLink>
        }
      />

      <form
        action="/admin/products"
        method="get"
        role="search"
        className="mb-6 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="product-search" className="sr-only">
          Search products by name or SKU
        </label>
        <Input
          id="product-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by name or SKU"
          className="sm:max-w-sm"
        />
        <Button type="submit" pill>
          Search
        </Button>
      </form>

      {products.length === 0 ? (
        <div className="nova-panel px-6 py-14 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-control bg-primary-tint text-primary">
            <PackageSearch aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="mt-4 text-sm font-medium text-ink">
            {query ? "No products matched your search." : "No products yet."}
          </p>
          <p className="mt-1 text-xs text-muted">
            {query
              ? "Try a different name or SKU."
              : "Add your first example item to show what you can source."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li key={product.id} className="nova-card nova-lift p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-control text-sm font-bold text-ink hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <StatusBadge status={product.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">SKU {product.sku}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-secondary-ink">
                    <span>{product.category?.name ?? "Uncategorized"}</span>
                    <span className="font-semibold text-ink">
                      {formatBDT(product.price_bdt)}
                    </span>
                    <span>{product.imageCount} photos</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    className={buttonClass({
                      variant: "secondary",
                      size: "icon",
                      className: "h-11 w-11 rounded-control",
                    })}
                  >
                    <Pencil aria-hidden="true" className="h-4 w-4" />
                  </Link>
                  <ConfirmButton
                    action={duplicateProduct.bind(null, product.id)}
                    confirmMessage={`Duplicate ${product.name} as a draft?`}
                    className={buttonClass({
                      variant: "secondary",
                      size: "icon",
                      className: "h-11 w-11 rounded-control",
                    })}
                  >
                    <Copy aria-hidden="true" className="h-4 w-4" />
                  </ConfirmButton>
                  <ConfirmButton
                    action={deleteProduct.bind(null, product.id)}
                    confirmMessage={`Permanently delete ${product.name} and its photos?`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border text-secondary-ink transition-colors hover:bg-blush hover:text-sale"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </ConfirmButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
