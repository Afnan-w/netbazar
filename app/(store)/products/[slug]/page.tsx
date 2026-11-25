import {
  ArrowLeft,
  Check,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { WishlistButton } from "@/components/store/wishlist-button";
import { getProductBySlug, getRelatedProducts, getSiteSettings } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import { discountPercent, marketplaceFor } from "@/lib/utils/marketplace";
import { absoluteProductUrl } from "@/lib/utils/product-url";
import { specificationRows } from "@/lib/utils/specifications";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/utils/whatsapp";

type ProductPageProps = { params: Promise<{ slug: string }> };

const badgeClasses: Record<string, string> = {
  "Best seller": "bg-primary text-white",
  Hot: "bg-blush text-primary",
  New: "bg-primary-tint text-primary ring-1 ring-primary/20",
  Limited: "bg-lilac text-primary",
};

const assurances = [
  "Price confirmed before payment",
  "Shipping and delivery agreed on WhatsApp",
  "No cart or checkout — order directly",
];

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const description =
    product.description.slice(0, 155) ||
    `${product.name} sourced from China for delivery in Bangladesh.`;
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : undefined;
  const canonical = absoluteProductUrl(product.slug);

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, related] = await Promise.all([
    getSiteSettings(),
    getRelatedProducts(product),
  ]);

  const price = formatBDT(product.price_bdt);
  const market = marketplaceFor(product);
  const discount = discountPercent(product.price_bdt, product.reference_price_bdt);
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    productOrderMessage({
      name: product.name,
      sku: product.sku,
      price,
      url: absoluteProductUrl(product.slug),
    }),
  );
  const specs = specificationRows(product.specifications);
  const available = product.status === "available";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/products"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-secondary-ink transition-colors hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="rounded-panel bg-image-backdrop p-3 sm:p-5">
          <ProductGallery
            images={product.images.map((image) => ({
              url: getProductImageUrl(image.storage_path),
              alt: image.alt || product.name,
            }))}
            productName={product.name}
            categorySlug={product.category?.slug ?? "everyday"}
          />
        </div>

        <aside className="nova-panel h-fit p-6 sm:p-7 lg:sticky lg:top-28">
          <div className="flex flex-wrap items-center gap-2">
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(product.category.slug)}`}
                className="inline-flex min-h-11 items-center rounded-badge border border-border bg-surface px-4 text-xs font-semibold text-secondary-ink transition-colors hover:border-primary hover:text-primary"
              >
                {product.category.name}
              </Link>
            )}
            {market.badge && (
              <span
                className={`inline-flex items-center rounded-badge px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClasses[market.badge] ?? ""}`}
              >
                {market.badge}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-ink">
            <span>SKU {product.sku}</span>
            <span className="inline-flex items-center gap-1 text-ink">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-star text-star" />
              {market.rating?.toFixed(1)} · {market.soldCount} sold
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-border py-5">
            <span className="text-3xl font-bold tracking-tight text-primary">{price}</span>
            {product.reference_price_bdt !== null && (
              <span className="text-lg text-muted line-through">
                {formatBDT(product.reference_price_bdt)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-badge bg-primary-tint px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
                Save {discount}%
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-badge px-3 py-1.5 text-xs font-semibold ${
                available
                  ? "bg-primary-tint text-primary ring-1 ring-primary/20"
                  : "bg-image-backdrop text-secondary-ink"
              }`}
            >
              <PackageCheck aria-hidden="true" className="h-3.5 w-3.5" />
              {available ? "Available" : "Unavailable"}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-secondary-ink">
              <Truck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Ships in {market.shippingDays}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-control bg-primary px-6 text-sm font-bold text-white shadow-card pressable hover:bg-primary-hover active:bg-primary-active"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Order on WhatsApp
            </a>
            <div className="flex items-center gap-2">
              <WishlistButton id={product.id} name={product.name} className="h-11 w-11" />
              <span className="text-xs text-secondary-ink">Save</span>
            </div>
          </div>

          <section className="mt-7 rounded-card border border-border bg-page/60 p-5">
            <div aria-hidden="true" className="flex flex-wrap gap-2">
              <span className="rounded-control bg-primary px-3 py-2 text-xs font-bold text-white shadow-card">
                Description
              </span>
              <span className="rounded-control bg-surface px-3 py-2 text-xs font-bold text-primary shadow-soft">
                Specifications
              </span>
              <span className="rounded-control bg-surface px-3 py-2 text-xs font-bold text-primary shadow-soft">
                Shipping
              </span>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Description
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
                  {product.description?.replace(/^(?:SAMPLE DATA|DEMO)\s*—\s*/, "") ||
                    "Details confirmed on WhatsApp."}
                </p>
              </div>

              <div className="border-t border-border pt-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Specifications
                </h2>
                {specs.length > 0 ? (
                  <dl className="mt-3 divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
                    {specs.map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[minmax(100px,0.8fr)_1.2fr] gap-4 px-4 py-2.5 text-sm"
                      >
                        <dt className="text-secondary-ink">{key}</dt>
                        <dd className="text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-3 text-sm text-secondary-ink">
                    Ask us on WhatsApp for full specifications.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Shipping
                </h2>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-secondary-ink">
                  <Truck aria-hidden="true" className="h-4 w-4 text-primary" />
                  Ships in {market.shippingDays}
                </p>
                <ul className="mt-3 space-y-2 text-xs text-secondary-ink">
                  {assurances.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <p className="mt-5 inline-flex items-center gap-2 text-xs text-secondary-ink">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
            Verified supplier listing
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <SectionHeader
            eyebrow="More to explore"
            title="Related products"
            action={{ href: "/products", label: "View all" }}
          />
          <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
