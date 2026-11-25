import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
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
        description="Create and manage the catalogue shown to customers."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            New product
          </Link>
        }
      />

      <form action="/admin/products" method="get" role="search" className="mb-6 flex gap-2">
        <label htmlFor="product-search" className="sr-only">
          Search products by name or SKU
        </label>
        <input
          id="product-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by name or SKU"
          className="w-full max-w-sm rounded-full border border-ink/15 bg-surface px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="rounded-full border border-ink/20 px-4 py-2 text-sm hover:border-brand hover:text-brand"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-surface">
        {products.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/55">
            {query ? "No products matched your search." : "No products yet. Add your first product."}
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Product</th>
                <th scope="col" className="px-5 py-3 font-medium">Category</th>
                <th scope="col" className="px-5 py-3 font-medium">Price</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium">Photos</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-canvas/60">
                  <td className="px-5 py-4">
                    <Link href={`/admin/products/${product.id}/edit`} className="font-medium hover:text-brand">
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink/45">SKU {product.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-ink/65">{product.category?.name ?? "—"}</td>
                  <td className="px-5 py-4 text-ink/75">{formatBDT(product.price_bdt)}</td>
                  <td className="px-5 py-4"><StatusBadge status={product.status} /></td>
                  <td className="px-5 py-4 text-ink/60">{product.imageCount}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 hover:border-brand hover:text-brand"
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                      </Link>
                      <ConfirmButton
                        action={duplicateProduct.bind(null, product.id)}
                        confirmMessage={`Duplicate ${product.name} as a draft?`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 hover:border-brand hover:text-brand"
                      >
                        <Copy aria-hidden="true" className="h-4 w-4" />
                      </ConfirmButton>
                      <ConfirmButton
                        action={deleteProduct.bind(null, product.id)}
                        confirmMessage={`Permanently delete ${product.name} and its photos?`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 text-ink/55 hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
