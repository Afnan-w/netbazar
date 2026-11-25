import {
  ArrowRight,
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
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { ProductGrid, SectionHeading } from "@/components/store/section-heading";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data/store";
import { getProductImageUrl } from "@/lib/utils/images";
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
  { icon: Search, title: "Browse", text: "Pick a product or request any item." },
  { icon: MessageCircle, title: "Confirm", text: "We confirm price and delivery on WhatsApp." },
  { icon: Wallet, title: "Pay", text: "Pay upfront after confirmation." },
  { icon: Truck, title: "Receive", text: "Supplier ships direct to Bangladesh." },
];

export default async function HomePage() {
  const [featured, categories, settings] = await Promise.all([
    getProducts({ featured: true, availability: "available", pageSize: 8 }),
    getCategories(),
    getSiteSettings(),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I would like to know more about your products.",
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-canvas/40">
        <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                China → Bangladesh
              </p>
              <h1 className="mt-4 max-w-xl text-balance text-4xl font-light leading-[1.1] tracking-tight sm:text-6xl">
                The good stuff,
                <br />
                <span className="text-ink/55">sourced simply.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/55">
                Curated products, BDT pricing, WhatsApp ordering. No cart, no noise.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-[0_14px_30px_-16px_rgba(22,168,120,0.8)] transition-opacity hover:opacity-90"
                >
                  Browse products
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink/70 transition-colors hover:border-brand hover:text-brand"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand/10 via-transparent to-mint/60 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-3">
                {featured.items.slice(0, 4).map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className={`group relative overflow-hidden rounded-[22px] border border-white/70 bg-surface shadow-[0_20px_50px_-30px_rgba(24,35,45,0.45)] ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  >
                    {p.images[0] ? (
                      <Image
                        src={getProductImageUrl(p.images[0].storage_path)}
                        alt={p.images[0].alt || p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 420px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="h-full w-full bg-mint/40" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-3 pt-10">
                      <p className="truncate text-xs font-medium text-white">{p.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Grid2X2;
            return (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink/70 transition-all hover:border-brand/40 hover:bg-mint/40 hover:text-brand"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {category.name}
              </Link>
            );
          })}
        </div>
      </section>

      {featured.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <SectionHeading title="Featured" action={{ href: "/products", label: "View all" }} />
          <ProductGrid>
            {featured.items.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </section>
      )}

      <section className="border-t border-ink/5 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-mint text-brand">
                  <step.icon aria-hidden="true" className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-ink/35">0{i + 1}</p>
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-ink/55">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
