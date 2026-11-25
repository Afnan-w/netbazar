import { ArrowLeft, MessageCircle, PackageCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
// import { PaymentNote } from "@/components/store/payment-note";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { SectionHeading } from "@/components/store/section-heading";
import { getProductBySlug, getRelatedProducts, getSiteSettings } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import { specificationRows } from "@/lib/utils/specifications";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/utils/whatsapp";

type ProductPageProps = { params: Promise<{ slug: string }> };

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

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
  const canonical = `${siteUrl()}/products/${product.slug}`;

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
  const pageUrl = `${siteUrl()}/products/${product.slug}`;
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    productOrderMessage({
      name: product.name,
      sku: product.sku,
      price,
      url: pageUrl,
    }),
  );
  const specs = specificationRows(product.specifications);
  const available = product.status === "available";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-ink/55 hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery
          images={product.images.map((image) => ({
            url: getProductImageUrl(image.storage_path),
            alt: image.alt || product.name,
          }))}
          productName={product.name}
          categorySlug={product.category?.slug ?? "everyday"}
        />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(product.category.slug)}`}
                className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/60 hover:border-brand hover:text-brand"
              >
                {product.category.name}
              </Link>
            )}
            {product.is_featured && (
              <span className="rounded-full border border-brand/40 px-3 py-1 text-xs text-brand">Featured</span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink/45">
            SKU {product.sku}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-brand">{price}</span>
            {product.reference_price_bdt !== null && (
              <span className="text-lg text-ink/40 line-through">
                {formatBDT(product.reference_price_bdt)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                available
                  ? "border-brand/30 bg-mint text-brand"
                  : "border-ink/15 text-ink/55"
              }`}
            >
              <PackageCheck aria-hidden="true" className="h-3.5 w-3.5" />
              {available ? "Available" : "Unavailable"}
            </span>
          </div>

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink/60">
            {product.description?.replace(/^(?:SAMPLE DATA|DEMO) — .*?\.\s*/, "") || "Details confirmed on WhatsApp."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-[0_14px_30px_-16px_rgba(22,168,120,0.8)] transition-opacity hover:opacity-90"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Order on WhatsApp
            </a>
            <span className="text-xs text-ink/40">Price & delivery confirmed before payment</span>
          </div>

          <section className="mt-10 border-t border-ink/10 pt-8">
            <h2 className="text-lg font-medium">Specifications</h2>
            {specs.length > 0 ? (
              <dl className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[minmax(100px,0.8fr)_1.2fr] gap-4 px-4 py-3 text-sm"
                  >
                    <dt className="text-ink/50">{key}</dt>
                    <dd className="text-ink/80">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-ink/55">
                Specifications will be added soon. Ask us on WhatsApp if you need
                more details.
              </p>
            )}
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-ink/10 pt-14">
          <SectionHeading
            eyebrow="More to explore"
            title="Related products"
            action={{ href: "/products", label: "View all" }}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
