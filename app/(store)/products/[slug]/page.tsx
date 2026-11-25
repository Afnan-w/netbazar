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
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { SectionHeading } from "@/components/store/section-heading";
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
  "Best seller": "bg-[#171C2C] text-white",
  Hot: "bg-[#4D8DCA] text-white",
  New: "bg-mint text-accent",
  Limited: "bg-[#E8F1FA] text-[#3C6FA3]",
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery
          images={product.images.map((image) => ({
            url: getProductImageUrl(image.storage_path),
            alt: image.alt || product.name,
          }))}
          productName={product.name}
          categorySlug={product.category?.slug ?? "everyday"}
        />

        <aside className="premium-card h-fit rounded-xl p-6 lg:sticky lg:top-32">
          <div className="flex flex-wrap items-center gap-2">
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(product.category.slug)}`}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-brand hover:text-brand"
              >
                {product.category.name}
              </Link>
            )}
            {market.badge && (
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeClasses[market.badge] ?? ""}`}
              >
                {market.badge}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span>SKU {product.sku}</span>
            <span className="inline-flex items-center gap-1 text-ink/70">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-accent text-accent" />
              {market.rating?.toFixed(1)} · {market.soldCount} sold
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-line py-5">
            <span className="text-3xl font-semibold text-brand">{price}</span>
            {product.reference_price_bdt !== null && (
              <span className="text-lg text-muted line-through">
                {formatBDT(product.reference_price_bdt)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-discount px-2.5 py-1 text-xs font-semibold text-white">
                Save {discount}%
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                available
                  ? "border-accent/30 bg-mint text-accent"
                  : "border-line text-muted"
              }`}
            >
              <PackageCheck aria-hidden="true" className="h-3.5 w-3.5" />
              {available ? "Available" : "Unavailable"}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-muted">
              <Truck aria-hidden="true" className="h-3.5 w-3.5 text-support" />
              Ships in {market.shippingDays}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">
            {product.description?.replace(/^(?:SAMPLE DATA|DEMO)\s*—\s*/, "") ||
              "Details confirmed on WhatsApp."}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-highlight"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Order on WhatsApp
            </a>
            <div className="flex items-center gap-2">
              <WishlistButton id={product.id} name={product.name} className="h-11 w-11" />
              <span className="text-xs text-muted">Save</span>
            </div>
          </div>

          <ul className="mt-5 space-y-2 border-t border-line pt-5 text-xs text-muted">
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                {item}
              </li>
            ))}
          </ul>

          <section className="mt-7 border-t border-line pt-6">
            <h2 className="text-sm font-medium">Specifications</h2>
            {specs.length > 0 ? (
              <dl className="mt-3 divide-y divide-line rounded-2xl border border-line">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[minmax(100px,0.8fr)_1.2fr] gap-4 px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted">{key}</dt>
                    <dd className="text-ink/85">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted">
                Ask us on WhatsApp for full specifications.
              </p>
            )}
          </section>

          <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-brand" />
            Verified supplier listing
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-14">
          <SectionHeading
            eyebrow="More to explore"
            title="Related products"
            action={{ href: "/products", label: "View all" }}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
