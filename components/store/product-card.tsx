import { ArrowUpRight, MessageCircle, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/store/product-visual";
import { WishlistButton } from "@/components/store/wishlist-button";
import type { ProductListItem } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import {
  discountPercent,
  marketplaceFor,
} from "@/lib/utils/marketplace";
import { absoluteProductUrl } from "@/lib/utils/product-url";
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
  productOrderMessage,
} from "@/lib/utils/whatsapp";

const badgeClasses: Record<string, string> = {
  "Best seller": "bg-[#083D31] text-white ring-1 ring-white/15",
  Hot: "bg-[#C9A961] text-[#083D31]",
  New: "bg-[#F5EEDF] text-[#8A6B23] ring-1 ring-[#E5D5AA]",
  Limited: "bg-[#F1EFE8] text-[#6A5A32]",
};

export function ProductCard({
  product,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}: {
  product: ProductListItem;
  whatsappNumber?: string;
}) {
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";
  const market = marketplaceFor(product);
  const discount = discountPercent(product.price_bdt, product.reference_price_bdt);
  const available = product.status === "available";

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    productOrderMessage({
      name: product.name,
      sku: product.sku,
      price: formatBDT(product.price_bdt),
      url: absoluteProductUrl(product.slug),
    }),
  );

  return (
    <article className="card-shine group relative flex h-full flex-col overflow-hidden rounded-2xl premium-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_22px_48px_-30px_rgba(8,61,49,0.5)]">
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0"
          aria-label={`View ${product.name}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.images[0].alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <ProductVisual
              categorySlug={product.category?.slug ?? "everyday"}
              name={product.name}
            />
          )}
        </Link>

        {market.badge && (
          <span
            className={`pointer-events-none absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeClasses[market.badge] ?? ""}`}
          >
            {market.badge}
          </span>
        )}
        {!available && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-muted backdrop-blur">
            Unavailable
          </span>
        )}

        <WishlistButton
          id={product.id}
          name={product.name}
          className="absolute right-3 top-3 z-20"
        />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#0a7055]"
        >
          <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
          Order
        </a>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-semibold uppercase tracking-[0.14em] text-muted">
            {product.category?.name ?? "General"}
          </span>
          <span className="inline-flex items-center gap-1 text-ink/75">
            <Star aria-hidden="true" className="h-3 w-3 fill-accent text-accent" />
            {market.rating?.toFixed(1)}
            <span className="text-muted">· {market.soldCount} sold</span>
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-ink">
              {formatBDT(product.price_bdt)}
            </span>
            {product.reference_price_bdt !== null && (
              <span className="text-xs text-muted line-through">
                {formatBDT(product.reference_price_bdt)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-semibold text-gold-ink ring-1 ring-accent/40">
              -{discount}%
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
          <Truck aria-hidden="true" className="h-3.5 w-3.5 text-brand" />
          Ships in {market.shippingDays}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-3 inline-flex items-center justify-between rounded-lg border border-line bg-canvas/40 px-3 py-2 text-xs font-medium text-brand transition-colors hover:border-brand/30 hover:bg-mint"
          aria-label={`View ${product.name}`}
        >
          View details
          <ArrowUpRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
