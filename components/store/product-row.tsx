import { ArrowUpRight, MessageCircle, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/store/product-visual";
import { WishlistButton } from "@/components/store/wishlist-button";
import type { ProductListItem } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import { discountPercent, marketplaceFor } from "@/lib/utils/marketplace";
import { absoluteProductUrl } from "@/lib/utils/product-url";
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
  productOrderMessage,
} from "@/lib/utils/whatsapp";

export function ProductRow({
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
    <article className="nova-card group flex flex-col gap-4 rounded-card p-4 nova-lift sm:flex-row sm:items-center">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-32 w-full shrink-0 overflow-hidden rounded-control bg-image-backdrop sm:h-28 sm:w-32"
        aria-label={`View ${product.name}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ProductVisual
            categorySlug={product.category?.slug ?? "everyday"}
            name={product.name}
            iconClassName="h-9 w-9"
          />
        )}
        {market.badge && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-badge bg-surface px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-card ring-1 ring-border/70">
            {market.badge}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted">
          <span className="font-semibold">{product.category?.name ?? "General"}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate normal-case tracking-normal">{product.sku}</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 truncate text-card-title font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1 text-secondary-ink">
            <Star aria-hidden="true" className="h-3 w-3 fill-star text-star" />
            {market.rating?.toFixed(1)} · {market.soldCount} sold
          </span>
          <span className="inline-flex items-center gap-1">
            <Truck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
            Ships in {market.shippingDays}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <WishlistButton id={product.id} name={product.name} />
        <div className="text-right">
          <p className="text-[18px] font-bold tracking-tight text-ink">
            {formatBDT(product.price_bdt)}
          </p>
          {discount > 0 && (
            <p className="mt-0.5 flex flex-wrap items-center justify-end gap-2 text-[11px] text-muted">
              <span className="line-through">
                {formatBDT(product.reference_price_bdt)}
              </span>
              <span className="rounded-badge bg-sale px-2 py-0.5 font-semibold text-white">
                -{discount}%
              </span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-border bg-surface text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card pressable"
          >
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary bg-primary px-4 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card active:translate-y-0 active:bg-primary-active pressable"
          >
            <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
            Order
          </a>
        </div>
      </div>
    </article>
  );
}
