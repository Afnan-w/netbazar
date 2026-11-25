import { ArrowUpRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/utils/images";
import { formatBDT } from "@/lib/utils/format";
import { isNewProduct } from "@/lib/utils/specifications";
import type { ProductListItem } from "@/lib/data/store";

export function ProductCard({ product }: { product: ProductListItem }) {
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";
  const available = product.status === "available";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-canvas transition-colors hover:border-brand/40">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-canvas text-ink/30">
            <Package aria-hidden="true" className="h-12 w-12" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.is_featured && (
            <span className="rounded-full border border-brand/40 bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-brand">
              Featured
            </span>
          )}
          {isNewProduct(product.created_at) && (
            <span className="rounded-full border border-ink/15 bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink/70">
              New
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
          {product.category?.name ?? "General"}
        </p>
        <h3 className="mt-1.5 text-base font-medium leading-snug">{product.name}</h3>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-brand">
            {formatBDT(product.price_bdt)}
          </span>
          {product.reference_price_bdt !== null && (
            <span className="text-sm text-ink/40 line-through">
              {formatBDT(product.reference_price_bdt)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${
              available
                ? "border-brand/30 bg-mint text-brand"
                : "border-ink/15 text-ink/55"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                available ? "bg-brand" : "bg-ink/35"
              }`}
            />
            {available ? "Available" : "Unavailable"}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand hover:text-brand"
            aria-label={`View ${product.name}`}
          >
            View
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
