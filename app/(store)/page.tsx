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
import { Reveal } from "@/components/store/reveal";
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
  "absolute left-0 top-4 rotate-[-5deg] animate-float-soft",
  "absolute right-2 top-0 rotate-[4deg] animate-float-soft [animation-delay:-2.4s]",
  "absolute bottom-0 left-24 rotate-[-2deg] animate-float-soft [animation-delay:-4.8s]",
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
    <div className="premium-card w-48 overflow-hidden rounded-xl bg-surface p-2 shadow-lg sm:w-56">
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
            <Star aria-hidden="true" className="h-3 w-3 fill-action text-action" />
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
      <section className="relative overflow-hidden bg-dark text-white">
        <div
          aria-hidden="true"
          className="animate-glow-soft pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 16% 18%, rgba(138,112,232,0.28), transparent 42%), radial-gradient(circle at 84% 78%, rgba(77,141,202,0.18), transparent 45%)",
          }}
        />
        <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div className="hero-enter">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-highlight opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-highlight" />
                </span>
                Discover the world of smart shopping
              </div>

              <h1 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                Everything You Want.
                <span className="text-highlight"> One Marketplace.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                Discover quality products sourced from China and delivered to Bangladesh.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-dark transition-colors hover:bg-action"
                >
                  Explore Products
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href="/#categories"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-highlight hover:text-highlight"
                >
                  Browse Categories
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/70">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-highlight" />
                  Verified suppliers
                </span>
                <span className="inline-flex items-center gap-2">
                  <WalletCards aria-hidden="true" className="h-4 w-4 text-highlight" />
                  BDT pricing
                </span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle aria-hidden="true" className="h-4 w-4 text-highlight" />
                  WhatsApp support
                </span>
              </div>
            </div>

            <div className="hero-enter relative hidden min-h-[440px] lg:block [animation-delay:0.12s]">
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

      <Reveal>
        <section id="categories" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line premium-card transition-all duration-300 hover:-translate-y-1 hover:border-action/40 hover:shadow-lg"
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
                      "linear-gradient(to top, rgba(23,28,44,0.82), rgba(23,28,44,0.12), transparent)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-white">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon aria-hidden="true" className="h-4 w-4 text-highlight" />
                    {category.name}
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
        </section>
      </Reveal>

      {featured.items.length > 0 && (
        <Reveal>
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
        </Reveal>
      )}

      <Reveal delay={60}>
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
      </Reveal>

      {popular.items.length > 0 && (
        <Reveal>
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
        </Reveal>
      )}

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-dark px-6 py-12 text-white sm:px-10">
          <div
            aria-hidden="true"
            className="animate-glow-soft absolute right-0 top-0 h-full w-1/2"
            style={{
              background:
                "radial-gradient(circle at 70% 40%, rgba(138,112,232,0.32), transparent 62%)",
            }}
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-highlight">
                Can’t find it?
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Request any product from China.
              </h2>
              <p className="mt-2 max-w-lg text-sm text-white/70">
                Send us the item, link or photo. We confirm availability, price and delivery on WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-dark transition-all hover:-translate-y-0.5 hover:bg-action"
              >
                Request any product
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:border-highlight hover:text-highlight"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal delay={60}>
      <section className="border-y border-line bg-surface/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple flow"
            title="Browse. Confirm. Receive."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="premium-card rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-action/40 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-accent">
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
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why Netbazar" title="Sourcing with clarity" />
        <div className="grid gap-4 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title} className="flex gap-4 rounded-xl border border-line bg-canvas/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-action/40 hover:bg-surface hover:shadow-lg">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-accent shadow-sm">
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
      </Reveal>
    </div>
  );
}
