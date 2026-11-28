import { ArrowUpRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { ProductMediaLink } from "@/components/store/product-media";
import type { ProductListItem } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";

export function ProductRow({ product }: { product: ProductListItem }) {
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";

  return (
    <article className="product-card nova-card group flex flex-col gap-4 overflow-hidden rounded-card p-4 nova-lift sm:flex-row sm:items-center">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-control bg-image-backdrop sm:h-28 sm:w-32">
        <ProductMediaLink
          href={`/products/${product.slug}`}
          name={product.name}
          imageUrl={imageUrl}
          alt={product.images[0].alt || product.name}
          sizes="(max-width: 640px) 100vw, 128px"
          categorySlug={product.category?.slug ?? "everyday"}
          iconClassName="h-9 w-9"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted">
          <span className="font-semibold">{product.category?.name ?? "General"}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate normal-case tracking-normal">Ref {product.sku}</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 truncate text-card-title font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs text-secondary-ink">
          {product.status === "available" ? "Ready to source" : "Ask us to source"} ·
          Final quote confirmed after supplier check.
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Indicative price
          </p>
          <p className="text-[18px] font-bold tracking-tight text-ink">
            {formatBDT(product.price_bdt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-border bg-surface text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card pressable"
          >
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href={`/request?item=${encodeURIComponent(product.slug)}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary bg-primary px-4 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card active:translate-y-0 pressable"
          >
            <ClipboardList aria-hidden="true" className="h-3.5 w-3.5" />
            Request a quote
          </Link>
        </div>
      </div>
    </article>
  );
}
