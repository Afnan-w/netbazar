import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { getProductBySlug, getRelatedProducts, getSiteSettings } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import { absoluteProductUrl } from "@/lib/utils/product-url";
import { specificationRows } from "@/lib/utils/specifications";
import { buildWhatsAppUrl, productQuoteMessage } from "@/lib/utils/whatsapp";

type ProductPageProps = { params: Promise<{ slug: string }> };

const assurances = [
  "We check supplier availability before quoting",
  "Quote includes unit price, shipping, total and delivery time",
  "You pay only after you accept the quote",
  "Order tracked from China to Bangladesh",
];

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Item not found" };

  const description =
    product.description.slice(0, 155) ||
    `${product.name} sourced from China for delivery in Bangladesh.`;
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : undefined;
  const canonical = absoluteProductUrl(product.slug);

  return {
    title: `${product.name} | Sourcing example`,
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
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    productQuoteMessage({
      name: product.name,
      sku: product.sku,
      price,
      url: absoluteProductUrl(product.slug),
    }),
  );
  const specs = specificationRows(product.specifications);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/products"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-secondary-ink transition-colors hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to sourcing examples
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
            <span className="inline-flex items-center rounded-badge bg-primary-tint px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              Sourcing example
            </span>
          </div>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xs text-secondary-ink">Ref {product.sku}</p>

          <div className="mt-6 border-y border-border py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Indicative price
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-primary">{price}</p>
            <p className="mt-2 text-sm text-secondary-ink">
              This is a reference only. Your quote includes the confirmed unit price,
              shipping to Bangladesh and delivery time.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-badge px-3 py-1.5 text-xs font-semibold ${
                product.status === "available"
                  ? "bg-primary-tint text-primary ring-1 ring-primary/20"
                  : "bg-image-backdrop text-secondary-ink"
              }`}
            >
              <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
              {product.status === "available"
                ? "Our supplier can usually source this"
                : "Ask us to check availability"}
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/request?item=${encodeURIComponent(product.slug)}`}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-control bg-primary px-6 text-sm font-bold text-white shadow-card pressable hover:bg-primary-hover active:bg-primary-active"
            >
              <ClipboardList aria-hidden="true" className="h-4 w-4" />
              Request a quote
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-border bg-surface px-5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-tint pressable"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-xs text-secondary-ink">
            Not exactly this item? Send us any photo or link — we source from Alibaba,
            AliExpress, 1688, Taobao and more.
          </p>

          <section className="mt-7 rounded-card border border-border bg-page/60 p-5">
            <div aria-hidden="true" className="flex flex-wrap gap-2">
              <span className="rounded-control bg-primary px-3 py-2 text-xs font-bold text-white shadow-card">
                Details
              </span>
              <span className="rounded-control bg-surface px-3 py-2 text-xs font-bold text-primary shadow-soft">
                Specifications
              </span>
              <span className="rounded-control bg-surface px-3 py-2 text-xs font-bold text-primary shadow-soft">
                Sourcing & delivery
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
                  Sourcing & delivery
                </h2>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-secondary-ink">
                  <Truck aria-hidden="true" className="h-4 w-4 text-primary" />
                  Delivered to your address in Bangladesh after you accept the quote.
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
            Supplier checked by Netbazar before your quote.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <SectionHeader
            eyebrow="More examples"
            title="Similar items we can source"
            action={{ href: "/products", label: "See all examples" }}
          />
          <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
