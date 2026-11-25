import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Compass,
  Cpu,
  Gamepad2,
  Gift,
  Grid2X2,
  Home,
  MessageCircle,
  Search,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Wallet,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { ProductVisual } from "@/components/store/product-visual";
import { ProductGrid, SectionHeading } from "@/components/store/section-heading";
import type { ProductListItem } from "@/lib/data/store";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import { marketplaceFor } from "@/lib/utils/marketplace";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const categoryIcons: Record<string, LucideIcon> = {
  "phone-accessories": Smartphone,
  "home-and-kitchen": Home,
  fashion: Shirt,
  electronics: Cpu,
  "toys-and-games": Gamepad2,
  "beauty-and-care": Sparkles,
  "outdoor-and-travel": Compass,
  everyday: Gift,
};

const steps = [
  { icon: Search, title: "Browse", text: "Find a product or ask for any item." },
  { icon: MessageCircle, title: "Confirm", text: "Price and delivery on WhatsApp." },
  { icon: Wallet, title: "Pay", text: "Pay upfront after confirmation." },
  { icon: Truck, title: "Receive", text: "Shipped direct to Bangladesh." },
];

const heroPositions = [
  "absolute left-0 top-4 rotate-[-5deg]",
  "absolute right-2 top-0 rotate-[4deg]",
  "absolute bottom-0 left-24 rotate-[-2deg]",
];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Curated catalogue",
    text: "Hand-picked products, not a noisy marketplace.",
  },
  {
    icon: WalletCards,
    title: "Clear BDT pricing",
    text: "Prices shown in taka with no checkout surprises.",
  },
  {
    icon: Clock3,
    title: "Confirmed first",
    text: "Shipping and delivery time agreed before payment.",
  },
];

function HeroProductCard({ product }: { product: ProductListItem }) {
  const market = marketplaceFor(product);
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";

  return (
    <div className="premium-card w-48 overflow-hidden rounded-2xl bg-white/95 p-2 shadow-2xl sm:w-56">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-canvas">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0].alt || product.name}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : (
          <ProductVisual
            categorySlug={product.category?.slug ?? "everyday"}
            name={product.name}
            iconClassName="h-10 w-10"
          />
        )}
      </div>
      <div className="px-1 pb-1 pt-2 text-ink">
        <p className="truncate text-xs font-medium">{product.name}</p>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-brand">{formatBDT(product.price_bdt)}</span>
          <span className="inline-flex items-center gap-1 text-muted">
            <Star aria-hidden="true" className="h-3 w-3 fill-accent text-accent" />
            {market.rating?.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [featured, arrivals, popular, categories, settings, all] = await Promise.all([
    getProducts({ featured: true, availability: "available", pageSize: 8 }),
    getProducts({ availability: "available", sort: "newest", pageSize: 4, offset: 8 }),
    getProducts({ popular: true, availability: "available", pageSize: 4, offset: 4 }),
    getCategories(),
    getSiteSettings(),
    getProducts({ availability: "available", pageSize: 48 }),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I would like to know more about your products.",
  );

  const heroProducts = [
    featured.items[0] ?? all.items[0],
    featured.items[1] ?? all.items[1],
    featured.items[2] ?? all.items[2],
  ].filter((product): product is ProductListItem => Boolean(product));

  const categoryImages = new Map<string, string>();
  for (const product of all.items) {
    const slug = product.category?.slug;
    if (slug && product.images[0] && !categoryImages.has(slug)) {
      categoryImages.set(slug, getProductImageUrl(product.images[0].storage_path));
    }
  }

  return (
    <div>
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, #073B2D 0%, #0D5C45 55%, #061A16 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(201,162,39,0.45), transparent 42%), radial-gradient(circle at 82% 80%, rgba(255,255,255,0.12), transparent 45%)",
          }}
        />
        <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                China → Bangladesh sourcing
              </div>

              <h1 className="mt-6 max-w-2xl text-balance text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl">
                Premium finds from China,
                <span className="text-accent"> delivered to Bangladesh.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                Curated products, BDT prices and WhatsApp ordering. No cart, no confusion — just a
                clear path from browsing to delivery.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-accent hover:text-white"
                >
                  Browse products
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href="/request"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent"
                >
                  Request any product
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/70">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-accent" />
                  Verified suppliers
                </span>
                <span className="inline-flex items-center gap-2">
                  <WalletCards aria-hidden="true" className="h-4 w-4 text-accent" />
                  BDT pricing
                </span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle aria-hidden="true" className="h-4 w-4 text-accent" />
                  WhatsApp support
                </span>
              </div>
            </div>

            <div className="relative hidden min-h-[440px] lg:block">
              <div
                aria-hidden="true"
                className="absolute left-8 top-4 h-[380px] w-[380px] rounded-full border border-white/10"
              />
              <div
                aria-hidden="true"
                className="absolute right-0 top-16 h-[340px] w-[340px] rounded-full border border-white/10"
              />
              {heroProducts.map((product, index) => (
                <div key={product.id} className={heroPositions[index]}>
                  <HeroProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Shop by category"
          action={{ href: "/products", label: "View all" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Grid2X2;
            const image = categoryImages.get(category.slug);
            return (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line premium-card"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={`${category.name} products`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0">
                    <ProductVisual
                      categorySlug={category.slug}
                      name={category.name}
                      iconClassName="h-10 w-10"
                    />
                  </div>
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,23,16,0.78), rgba(6,23,16,0.12), transparent)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-white">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon aria-hidden="true" className="h-4 w-4 text-accent" />
                    {category.name}
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {featured.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Curated for you"
            title="Featured picks"
            action={{ href: "/products", label: "View all" }}
          />
          <ProductGrid>
            {featured.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </ProductGrid>
        </section>
      )}

      <section className="border-y border-line bg-surface/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals"
            action={{ href: "/products?sort=newest", label: "See all" }}
          />
          <ProductGrid>
            {arrivals.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </ProductGrid>
        </div>
      </section>

      {popular.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trending"
            title="Best sellers"
            action={{ href: "/products", label: "Browse" }}
          />
          <ProductGrid>
            {popular.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </ProductGrid>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[32px] px-6 py-12 text-white sm:px-10"
          style={{ background: "linear-gradient(120deg, #0D5C45, #073B2D)" }}
        >
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1/2 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 70% 40%, rgba(201,162,39,0.6), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Can’t find it?
              </p>
              <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
                Request any product from China.
              </h2>
              <p className="mt-2 max-w-lg text-sm text-white/70">
                Send us the item, link or photo. We confirm availability, price and delivery on WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand hover:bg-accent hover:text-white"
              >
                Request any product
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple flow"
            title="Browse. Confirm. Receive."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="premium-card rounded-[20px] p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-brand">
                    <step.icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-muted">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-sm font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why Netbazar" title="Sourcing with clarity" />
        <div className="grid gap-4 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title} className="flex gap-4 rounded-[20px] border border-line bg-canvas/50 p-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-brand shadow-sm">
                <point.icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-medium">{point.title}</h3>
                <p className="mt-1 text-sm text-muted">{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
