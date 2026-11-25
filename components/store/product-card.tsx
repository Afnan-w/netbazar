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
  "Best seller": "bg-[#171C2C] text-white",
  Hot: "bg-[#4D8DCA] text-white",
  New: "bg-mint text-accent",
  Limited: "bg-[#E8F1FA] text-[#3C6FA3]",
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
    <article className="card-shine group relative flex h-full flex-col overflow-hidden rounded-xl premium-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-28px_rgba(23,28,44,0.4)]">
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
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
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
        {discount > 0 && (
          <span className="pointer-events-none absolute left-3 top-11 z-10 rounded-full bg-discount px-2 py-0.5 text-[10px] font-semibold text-white">
            -{discount}%
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
          className="absolute bottom-3 right-3 z-20 inline-flex translate-y-1 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[11px] font-medium text-white opacity-100 shadow-lg transition-all hover:bg-highlight md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
        >
          <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
          Order
        </a>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-medium uppercase tracking-wider text-muted">
            {product.category?.name ?? "General"}
          </span>
          <span className="inline-flex items-center gap-1 text-ink/70">
            <Star aria-hidden="true" className="h-3 w-3 fill-accent text-accent" />
            {market.rating?.toFixed(1)}
            <span className="text-muted">({market.soldCount})</span>
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ink transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-ink">
            {formatBDT(product.price_bdt)}
          </span>
          {product.reference_price_bdt !== null && (
            <span className="text-xs text-muted line-through">
              {formatBDT(product.reference_price_bdt)}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
          <Truck aria-hidden="true" className="h-3.5 w-3.5 text-support" />
          Ships in {market.shippingDays}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-xs font-medium text-ink/75 transition-colors hover:border-accent hover:bg-accent hover:text-white"
          aria-label={`View ${product.name}`}
        >
          View details
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
