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
  Shirt,
  Smartphone,
  Sparkles,
  Star,
  Tags,
  Truck,
  Wallet,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryRow, type CategoryItem, type CategoryTone } from "@/components/ui/category-row";
import { Hero } from "@/components/ui/hero";
import { PromoCard } from "@/components/ui/promo-card";
import { SectionHeader } from "@/components/ui/section-header";
import { TrustStrip } from "@/components/ui/trust-strip";
import { ProductCard } from "@/components/store/product-card";
import { ProductVisual } from "@/components/store/product-visual";
import { Reveal } from "@/components/store/reveal";
import { ProductGrid } from "@/components/store/section-heading";
import type { ProductListItem } from "@/lib/data/store";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data/store";
import { formatBDT } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/images";
import { marketplaceFor } from "@/lib/utils/marketplace";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const sectionClass = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

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

const categoryTones: CategoryTone[] = ["lilac", "blush", "sage", "peach", "primary", "lilac"];

const steps = [
  { icon: Search, title: "Browse", text: "Find a product or ask for any item." },
  { icon: MessageCircle, title: "Confirm", text: "Price and delivery on WhatsApp." },
  { icon: Wallet, title: "Pay", text: "Pay upfront after confirmation." },
  { icon: Truck, title: "Receive", text: "Shipped direct to Bangladesh." },
];

const stepTones = ["bg-lilac", "bg-blush", "bg-sage", "bg-peach"];

const heroPositions = [
  "absolute left-0 top-2 rotate-[-5deg] animate-float-soft",
  "absolute right-0 top-0 rotate-[4deg] animate-float-soft [animation-delay:-2.4s]",
  "absolute bottom-0 left-20 rotate-[-2deg] animate-float-soft [animation-delay:-4.8s]",
];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Curated catalogue",
    description: "Hand-picked products, not a noisy marketplace.",
  },
  {
    icon: WalletCards,
    title: "Clear BDT pricing",
    description: "Prices shown in taka with no checkout surprises.",
  },
  {
    icon: Clock3,
    title: "Confirmed first",
    description: "Shipping and delivery time agreed before payment.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp support",
    description: "Ask about any product before you order.",
  },
];

function HeroProductCard({ product }: { product: ProductListItem }) {
  const market = marketplaceFor(product);
  const imageUrl = product.images[0]
    ? getProductImageUrl(product.images[0].storage_path)
    : "";

  return (
    <div className="glass-panel w-44 rounded-card border border-white/60 p-2 shadow-card-hover ring-1 ring-white/20 backdrop-blur sm:w-52">
      <div className="relative aspect-square overflow-hidden rounded-control bg-image-backdrop">
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
        <p className="truncate text-xs font-semibold">{product.name}</p>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="font-bold text-primary">{formatBDT(product.price_bdt)}</span>
          <span className="inline-flex items-center gap-1 text-secondary-ink">
            <Star aria-hidden="true" className="h-3 w-3 fill-star text-star" />
            {market.rating?.toFixed(1)}
          </span>
        </div>
        {market.badge && (
          <span className="mt-2 inline-flex rounded-badge bg-primary-tint px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
            {market.badge}
          </span>
        )}
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

  const categoryItems: CategoryItem[] = categories.slice(0, 6).map((category, index) => ({
    label: category.name,
    href: `/products?category=${encodeURIComponent(category.slug)}`,
    icon: categoryIcons[category.slug] ?? Grid2X2,
    tone: categoryTones[index % categoryTones.length],
  }));

  return (
    <div className="space-y-8 pb-12 sm:space-y-10">
      <section className={`${sectionClass} pt-6 sm:pt-8`}>
        <Hero
          eyebrow="DISCOVER THE WORLD OF SMART SHOPPING"
          title={
            <>
              Everything You Want.{" "}
              <span className="text-white/85">One Marketplace.</span>
            </>
          }
          description="Discover quality products sourced from China and delivered to Bangladesh."
          primaryAction={{ href: "/products", label: "Explore Products" }}
          secondaryAction={{ href: "/#categories", label: "Browse Categories" }}
        >
          <div className="relative hidden min-h-[400px] lg:block">
            <div
              aria-hidden="true"
              className="absolute left-6 top-2 h-[340px] w-[340px] rounded-full border border-white/25"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-14 h-[300px] w-[300px] rounded-full border border-white/25"
            />
            {heroProducts.map((product, index) => (
              <div key={product.id} className={heroPositions[index]}>
                <HeroProductCard product={product} />
              </div>
            ))}
          </div>
        </Hero>
      </section>

      <Reveal>
        <section id="categories" className={sectionClass}>
          <SectionHeader
            eyebrow="Explore"
            title="Shop by category"
            action={{ href: "/products", label: "View all" }}
          />
          {categoryItems.length > 0 ? (
            <CategoryRow items={categoryItems} />
          ) : (
            <div className="nova-card p-8 text-center text-sm text-secondary-ink">
              Categories are being prepared.
            </div>
          )}
        </section>
      </Reveal>

      <Reveal>
        <section className={sectionClass}>
          <SectionHeader eyebrow="This week" title="Offers worth a look" />
          <div className="grid gap-4 md:grid-cols-3">
            <PromoCard
              tone="blush"
              eyebrow="Flash sale"
              title="Fresh finds"
              subtitle="New picks from our suppliers."
              href="/products?sort=newest"
              countdown="23:59:59"
            >
              <Sparkles aria-hidden="true" className="h-20 w-20 text-primary/25" />
            </PromoCard>
            <PromoCard
              tone="sage"
              eyebrow="Everyday"
              title="Home & essentials"
              subtitle="Simple things for every day."
              href="/products"
            >
              <Tags aria-hidden="true" className="h-20 w-20 text-primary/25" />
            </PromoCard>
            <PromoCard
              tone="peach"
              eyebrow="Most loved"
              title="Favourite picks"
              subtitle="The products customers ask for most."
              href="/products?featured=1"
            >
              <Gift aria-hidden="true" className="h-20 w-20 text-primary/25" />
            </PromoCard>
          </div>
        </section>
      </Reveal>

      {featured.items.length > 0 && (
        <Reveal>
          <section className={sectionClass}>
            <SectionHeader
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
        <section className={`${sectionClass} rounded-panel bg-surface/60 py-8 sm:py-10`}>
          <SectionHeader
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
        </section>
      </Reveal>

      {popular.items.length > 0 && (
        <Reveal>
          <section className={sectionClass}>
            <SectionHeader
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
        <section className={sectionClass}>
          <div className="nova-panel relative overflow-hidden bg-lilac/50 p-6 sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-badge bg-surface/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                  Can’t find it?
                </span>
                <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Request any product from China.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
                  Send us the item, link or photo. We confirm availability, price and delivery on WhatsApp.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/request"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-card pressable hover:bg-primary-hover active:bg-primary-active"
                >
                  Request any product
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface/70 px-6 text-sm font-semibold text-primary pressable hover:bg-primary-tint"
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
        <section className={`${sectionClass} rounded-panel bg-surface/60 py-8 sm:py-10`}>
          <SectionHeader eyebrow="How it works" title="Browse. Confirm. Receive." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="nova-card nova-lift relative overflow-hidden rounded-card p-5"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-primary/60" />
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-control text-primary ${stepTones[index]}`}
                  >
                    <step.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="text-xs font-bold tabular-nums text-primary">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-secondary-ink">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={sectionClass}>
          <SectionHeader eyebrow="Why Netbazar" title="Sourcing with clarity" />
          <TrustStrip items={trustPoints} />
        </section>
      </Reveal>
    </div>
  );
}
