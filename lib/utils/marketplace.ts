import type { ProductListItem } from "@/lib/data/store";

type MarketplaceData = NonNullable<ProductListItem["marketplace"]>;

type MarketplaceInput = Pick<
  ProductListItem,
  "id" | "created_at" | "is_featured" | "is_popular" | "marketplace"
>;

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) {
    result = (result * 31 + value.charCodeAt(i)) >>> 0;
  }
  return result;
}

/** Deterministic marketplace signals for catalogue products without admin metadata. */
export function marketplaceFor(
  product: MarketplaceInput,
  index = 0,
): MarketplaceData {
  const seed = hash(product.id) + index;
  const explicit = product.marketplace;
  const isRecent =
    Date.now() - new Date(product.created_at).getTime() <
    14 * 24 * 60 * 60 * 1000;

  const badge =
    explicit?.badge ??
    (product.is_featured
      ? seed % 2 === 0
        ? "Best seller"
        : "Hot"
      : isRecent && index % 2 === 0
        ? "New"
        : product.is_popular
          ? "Hot"
          : "Limited");

  return {
    badge,
    rating: explicit?.rating ?? Number((4.4 + (seed % 6) / 10).toFixed(1)),
    soldCount: explicit?.soldCount ?? 180 + (seed % 3200),
    shippingDays:
      explicit?.shippingDays ??
      ["5–8 days", "7–10 days", "9–12 days"][seed % 3],
  };
}

export function discountPercent(
  price: number,
  reference: number | null,
): number {
  if (!reference || reference <= price) return 0;
  return Math.min(90, Math.round(((reference - price) / reference) * 100));
}

export function shippingDaysValue(value: string | undefined): number {
  if (!value) return 12;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 12;
}
