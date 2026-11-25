import {
  ArrowRight,
  CircleHelp,
  Compass,
  Cpu,
  Gamepad2,
  Gift,
  Grid2X2,
  Home,
  MessageCircle,
  PackageCheck,
  Search,
  Shirt,
  Smartphone,
  Sparkles,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { PaymentNote } from "@/components/store/payment-note";
import { ProductCard } from "@/components/store/product-card";
import { ProductGrid, SectionHeading } from "@/components/store/section-heading";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data/store";
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
  {
    icon: Search,
    title: "Choose or request",
    text: "Browse the catalogue or tell us what you are looking for.",
  },
  {
    icon: MessageCircle,
    title: "We confirm details",
    text: "Chat with us on WhatsApp about availability and options.",
  },
  {
    icon: Wallet,
    title: "You pay upfront",
    text: "Pay Netbazar after the final price and delivery time are agreed.",
  },
  {
    icon: Truck,
    title: "Supplier ships to you",
    text: "The supplier sends your order directly to your address in Bangladesh.",
  },
];

const reasons = [
  "A small, hand-picked catalogue instead of an overwhelming marketplace.",
  "One WhatsApp conversation for questions, confirmation and delivery updates.",
  "Prices shown in BDT, with final shipping and delivery time confirmed before payment.",
  "Product requests welcomed for items that are not listed yet.",
];

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Choose a product and tap Order on WhatsApp, or use the request form if it is not listed. We confirm availability, final price, shipping and delivery time before you pay.",
  },
  {
    question: "When do I pay?",
    answer:
      "Payment is upfront to Netbazar, but only after we have confirmed the final price, shipping cost and delivery time with you on WhatsApp.",
  },
  {
    question: "Who ships the product?",
    answer:
      "Netbazar pays the supplier after you pay. The supplier ships directly to your address in Bangladesh.",
  },
  {
    question: "Can I ask for a product that is not on the site?",
    answer:
      "Yes. Use the request a product form with a link or description and we will check whether we can source it.",
  },
];

export default async function HomePage() {
  const [featured, arrivals, popular, categories, settings] = await Promise.all([
    getProducts({ featured: true, availability: "available", pageSize: 8 }),
    getProducts({ availability: "available", pageSize: 4, sort: "newest" }),
    getProducts({ popular: true, availability: "available", pageSize: 4 }),
    getCategories(),
    getSiteSettings(),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I would like to know more about your products.",
  );

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/5 bg-canvas/60">
        <div
          aria-hidden="true"
          className="hairline-grid pointer-events-none absolute inset-0 opacity-50"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-brand/30 bg-mint/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                Preview catalogue
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/40">
                Sample data
              </span>
            </div>
            <h1 className="mt-5 max-w-2xl text-balance text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl">
              Find it here.
              <br />
              Source it simply.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/65">
              Hand-picked products from Chinese suppliers, listed in BDT and
              delivered to your door in Bangladesh. Order or request on WhatsApp.
            </p>

            <form action="/products" method="get" role="search" className="mt-7 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-surface p-1.5 pl-4 shadow-[0_16px_44px_-30px_rgba(24,35,45,0.6)] transition-colors focus-within:border-brand">
                <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink/45" />
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Search products, categories or SKU"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink/50">
              <span>Try:</span>
              {[
                { label: "speaker", href: "/products?q=speaker" },
                { label: "toys", href: "/products?category=toys-and-games" },
                { label: "backpack", href: "/products?q=backpack" },
              ].map((term) => (
                <Link
                  key={term.label}
                  href={term.href}
                  className="rounded-full border border-ink/15 px-2.5 py-1 transition-colors hover:border-brand hover:text-brand"
                >
                  {term.label}
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Shop now
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
              >
                Request a product
              </Link>
            </div>
            <div className="mt-8 max-w-xl">
              <PaymentNote />
            </div>
          </div>

          <div className="glass-panel relative hidden min-h-[380px] rounded-[2rem] border border-ink/10 p-8 shadow-[0_40px_90px_-60px_rgba(24,35,45,0.65)] lg:block">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-8 h-20 w-20 rounded-full border border-brand/20"
            />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-brand">
                  <PackageCheck aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className="mt-8 max-w-xs text-2xl font-light leading-snug">
                  A calmer way to browse, ask and order.
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/55">
                  No cart and no checkout. Just a clear confirmation on WhatsApp.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {["Curated picks", "WhatsApp first", "BDT prices", "Direct delivery"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-ink/10 bg-surface/70 px-4 py-4 backdrop-blur"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="Start with what you need. Every listing links to WhatsApp for confirmation."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.length > 0 ? (
            categories.map((category) => {
              const Icon = categoryIcons[category.slug] ?? Grid2X2;
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-canvas p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_20px_45px_-30px_rgba(24,35,45,0.45)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/8 transition-colors group-hover:bg-brand/12"
                  />
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-brand">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-medium">{category.name}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-ink/50 group-hover:text-brand">
                    Explore
                    <ArrowRight aria-hidden="true" className="h-3 w-3" />
                  </span>
                </Link>
              );
            })
          ) : (
            <p className="col-span-full text-sm text-ink/60">
              Categories will appear here once they are added in the admin dashboard.
            </p>
          )}
        </div>
      </section>

      {featured.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured products"
            action={{ href: "/products", label: "View all products" }}
          />
          <ProductGrid>
            {featured.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </section>
      )}

      {arrivals.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Just listed"
            title="New arrivals"
            action={{ href: "/products?sort=newest", label: "See newest" }}
          />
          <ProductGrid>
            {arrivals.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </section>
      )}

      {popular.items.length > 0 && (
        <section className="bg-canvas/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Popular picks"
              title="Popular products"
              action={{ href: "/products", label: "Browse catalogue" }}
            />
            <ProductGrid>
              {popular.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Four simple steps"
          description="No cart and no online checkout. We keep the process clear from enquiry to delivery."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-ink/10 bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <step.icon aria-hidden="true" className="h-6 w-6 text-brand" />
                <span className="text-xs font-medium text-ink/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-base font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mint/50 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Why Netbazar
            </p>
            <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
              Sourcing, kept personal.
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex gap-3 rounded-2xl border border-brand/15 bg-surface/70 p-4 text-sm leading-relaxed text-ink/70"
              >
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked"
          action={{ href: "/faq", label: "Read all FAQs" }}
        />
        <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-surface px-5">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <CircleHelp
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-brand transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{faq.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-mint"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Ask us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
