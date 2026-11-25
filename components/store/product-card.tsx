import { ArrowUpRight, MessageCircle, Star, Truck } from "lucide-react";
import Link from "next/link";
import { ProductMediaLink } from "@/components/store/product-media";
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
  "Best seller": "bg-primary text-white ring-1 ring-primary/20",
  Hot: "bg-sale text-white ring-1 ring-sale/20",
  New: "bg-lilac text-primary ring-1 ring-primary/15",
  Limited: "bg-peach text-secondary-ink ring-1 ring-border/70",
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

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {discount > 0 && (
            <span className="rounded-badge bg-sale px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-card">
              -{discount}%
            </span>
          )}
          {market.badge && (
            <span
              className={`rounded-badge px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-card ${
                badgeClasses[market.badge] ?? ""
              }`}
            >
              {market.badge}
            </span>
          )}
        </div>
        {!available && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-badge bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-muted shadow-card ring-1 ring-border/70 backdrop-blur">
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
          className="absolute bottom-3 right-3 z-20 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary bg-primary px-4 text-[11px] font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 active:bg-primary-active pressable"
        >
          <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
          Order
        </a>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="truncate font-semibold uppercase tracking-[0.14em] text-muted">
            {product.category?.name ?? "General"}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-secondary-ink">
            <Star aria-hidden="true" className="h-3 w-3 fill-star text-star" />
            {market.rating?.toFixed(1)}
            <span className="text-muted">· {market.soldCount} sold</span>
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-card-title font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 truncate text-[11px] text-muted">{product.sku}</p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[18px] font-bold tracking-tight text-ink">
              {formatBDT(product.price_bdt)}
            </span>
            {product.reference_price_bdt !== null && (
              <span className="text-xs text-muted line-through">
                {formatBDT(product.reference_price_bdt)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
          <Truck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
          Ships in {market.shippingDays}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-auto inline-flex min-h-11 items-center justify-between rounded-control border border-border bg-page/60 px-4 py-2 text-xs font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-tint hover:text-primary hover:shadow-card active:translate-y-0 pressable"
          aria-label={`View ${product.name}`}
        >
          View details
          <ArrowUpRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
