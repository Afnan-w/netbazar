import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/store/product-visual";
import { getProductImageUrl } from "@/lib/utils/images";
import { formatBDT } from "@/lib/utils/format";
import { isNewProduct } from "@/lib/utils/specifications";
import type { ProductListItem } from "@/lib/data/store";

export function ProductCard({ product }: { product: ProductListItem }) {
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";
  const available = product.status === "available";
  const isDemo = product.sku.startsWith("SAMPLE-");
  const description = product.description.replace(
    /^SAMPLE DATA — replace with supplier-verified details\.\s*/,
    "",
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-ink/10 bg-surface shadow-[0_12px_40px_-30px_rgba(24,35,45,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_26px_64px_-34px_rgba(24,35,45,0.5)]">
      <div className="relative m-2.5 aspect-[4/3] overflow-hidden rounded-[20px] bg-canvas">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <ProductVisual
            categorySlug={product.category?.slug ?? "everyday"}
            name={product.name}
          />
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.is_featured && (
            <span className="rounded-full border border-brand/35 bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-brand shadow-sm backdrop-blur">
              Featured
            </span>
          )}
          {isNewProduct(product.created_at) && (
            <span className="rounded-full border border-ink/15 bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink/70 shadow-sm backdrop-blur">
              New
            </span>
          )}
        </div>

        {isDemo && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-ink/15 bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur">
            Demo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/45">
          {product.category?.name ?? "General"}
        </p>
        <h3 className="mt-1.5 text-base font-medium leading-snug">{product.name}</h3>
        {description && (
          <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-ink/55">
            {description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-ink/5 pt-4">
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
            className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand hover:bg-mint/60 hover:text-brand"
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
