import { ArrowUpRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { ProductMediaLink } from "@/components/store/product-media";
import type { ProductListItem } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";

export function ProductCard({ product }: { product: ProductListItem }) {
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";

  return (
    <article className="product-card nova-card group relative flex h-full flex-col overflow-hidden rounded-card nova-lift">
      <div className="relative aspect-square overflow-hidden rounded-t-card bg-image-backdrop">
        <ProductMediaLink
          href={`/products/${product.slug}`}
          name={product.name}
          imageUrl={imageUrl}
          alt={product.images[0].alt || product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          categorySlug={product.category?.slug ?? "everyday"}
        />
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-badge bg-surface/90 px-2.5 py-1 text-[10px] font-semibold text-primary shadow-card ring-1 ring-border/70 backdrop-blur">
          {product.status === "available" ? "Ready to source" : "Ask us to source"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {product.category?.name ?? "General"}
        </p>

        <Link href={`/products/${product.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-card-title font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 truncate text-[11px] text-muted">Ref {product.sku}</p>

        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Indicative price
          </p>
          <p className="text-[18px] font-bold tracking-tight text-ink">
            {formatBDT(product.price_bdt)}
          </p>
          <p className="mt-0.5 text-[11px] text-secondary-ink">
            Final quote confirmed after supplier check.
          </p>
        </div>

        <Link
          href={`/request?item=${encodeURIComponent(product.slug)}`}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-bold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 pressable"
        >
          <ClipboardList aria-hidden="true" className="h-3.5 w-3.5" />
          Request a quote
        </Link>
        <Link
          href={`/products/${product.slug}`}
          className="mt-2 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-control text-[11px] font-semibold text-secondary-ink transition-colors duration-200 hover:text-primary"
        >
          View details
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
