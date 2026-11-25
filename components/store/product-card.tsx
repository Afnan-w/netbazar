import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/store/product-visual";
import { getProductImageUrl } from "@/lib/utils/images";
import { formatBDT } from "@/lib/utils/format";
import type { ProductListItem } from "@/lib/data/store";

export function ProductCard({ product }: { product: ProductListItem }) {
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";
  const available = product.status === "available";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-ink/8 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_50px_-30px_rgba(24,35,45,0.35)]">
      <div className="relative aspect-[4/4.5] overflow-hidden bg-canvas">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProductVisual
            categorySlug={product.category?.slug ?? "everyday"}
            name={product.name}
          />
        )}
        {!available && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink/60 backdrop-blur">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/40">
          {product.category?.name ?? "General"}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-snug text-ink/90">
          {product.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink">
            {formatBDT(product.price_bdt)}
          </span>
          {product.reference_price_bdt !== null && (
            <span className="text-xs text-ink/35 line-through">
              {formatBDT(product.reference_price_bdt)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-ink/10 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
            aria-label={`View ${product.name}`}
          >
            View details
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
