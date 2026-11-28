import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ClipboardList,
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
  Truck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CategoryRow, type CategoryItem, type CategoryTone } from "@/components/ui/category-row";
import { Hero } from "@/components/ui/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { TrustStrip } from "@/components/ui/trust-strip";
import { Reveal } from "@/components/store/reveal";
import { getCategories, getSiteSettings } from "@/lib/data/store";
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
  {
    icon: ClipboardList,
    title: "Send a request",
    text: "Share a photo, a product link or just a description — plus quantity and budget. From Alibaba, AliExpress, 1688, Taobao or anywhere else.",
  },
  {
    icon: Search,
    title: "We check suppliers",
    text: "Our team checks whether our trusted supplier in China can provide that exact item.",
  },
  {
    icon: WalletCards,
    title: "You get a quote",
    text: "We send the unit price, shipping, total cost and delivery time before any payment.",
  },
  {
    icon: Truck,
    title: "Accept & track",
    text: "Once you accept, we connect you with the supplier and track your order to Bangladesh.",
  },
];

const stepTones = ["bg-lilac", "bg-blush", "bg-sage", "bg-peach"];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Trusted suppliers",
    description: "We check the source before we quote — no guesswork.",
  },
  {
    icon: WalletCards,
    title: "One clear quote",
    description: "Unit price, shipping and total in BDT, confirmed up front.",
  },
  {
    icon: Clock3,
    title: "Delivery agreed first",
    description: "You know the timeline before you decide to pay.",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp chat",
    description: "Photos, questions and updates in one conversation.",
  },
];

const sources = ["Alibaba", "AliExpress", "1688", "Taobao", "Any product link"];

export default async function HomePage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I want to source a product from China. Can you help me?",
  );

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
          eyebrow="CHINA SOURCING FOR BANGLADESH"
          title={
            <>
              Show us what you want from China.{" "}
              <span className="text-white/85">We&apos;ll source it for you.</span>
            </>
          }
          description="Send a photo, a link or just a description. We check our trusted suppliers, send you a quote with shipping and delivery time, and connect you with the supplier."
          primaryAction={{ href: "/request", label: "Submit a product request" }}
          secondaryAction={{ href: "#how-it-works", label: "See how it works" }}
        />
      </section>

      <Reveal>
        <section id="categories" className={`${sectionClass} scroll-mt-28`}>
          <SectionHeader
            eyebrow="What we can source"
            title="Tell us what you have in mind"
            action={{ href: "/products", label: "See examples" }}
          />
          {categoryItems.length > 0 ? (
            <CategoryRow items={categoryItems} />
          ) : (
            <div className="nova-card p-8 text-center text-sm text-secondary-ink">
              Just send us your item — we handle the sourcing.
            </div>
          )}
          <p className="mt-4 text-center text-xs text-secondary-ink">
            These are example categories. Your item does not need to be listed here —
            send us anything you find in China.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section id="how-it-works" className={`${sectionClass} scroll-mt-28`}>
          <SectionHeader
            eyebrow="How sourcing works"
            title="From your find to your doorstep"
          />
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

      <Reveal delay={60}>
        <section className={sectionClass}>
          <div className="nova-panel relative overflow-hidden p-6 sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                  Not a store — a sourcing service
                </span>
                <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Seen it on Alibaba, AliExpress, 1688 or Taobao? Send it to us.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary-ink">
                  Netbazar is not a product marketplace with a cart. We are your sourcing
                  partner in China: we check the supplier, work out the real landed cost
                  to Bangladesh and introduce you before you pay.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <span
                      key={source}
                      className="rounded-full border border-border bg-page/60 px-3 py-1.5 text-xs font-medium text-secondary-ink"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-card border border-border bg-page/60 p-5 sm:p-6">
                <h3 className="text-sm font-bold text-ink">What we handle for you</h3>
                <ul className="mt-4 space-y-3 text-sm text-secondary-ink">
                  {[
                    "Finding the right supplier and checking availability",
                    "Quoting unit price, shipping, total and delivery time",
                    "Connecting you with the supplier after you accept",
                    "Tracking the order until it reaches Bangladesh",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <BadgeCheck
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">Unit price</dt>
                    <dd className="mt-1 text-xs font-semibold text-ink">Confirmed</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">Shipping to BD</dt>
                    <dd className="mt-1 text-xs font-semibold text-ink">In quote</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">Delivery time</dt>
                    <dd className="mt-1 text-xs font-semibold text-ink">Agreed first</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  No cart, no add-to-checkout games. You approve one clear quote before
                  payment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

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
                  <Camera aria-hidden="true" className="h-3.5 w-3.5" />
                  Already know what you want?
                </span>
                <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Send the photo or link. We&apos;ll do the rest.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
                  One request is all it takes. We reply on WhatsApp with supplier
                  availability and a full quote in BDT.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/request"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-card pressable hover:bg-primary-hover active:bg-primary-active"
                >
                  Start a sourcing request
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface/70 px-6 text-sm font-semibold text-primary pressable hover:bg-primary-tint"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  Chat with us
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={60}>
        <section className={`${sectionClass} rounded-panel bg-surface/60 py-8 sm:py-10`}>
          <SectionHeader eyebrow="Why Netbazar" title="Sourcing with clarity" />
          <TrustStrip items={trustPoints} />
          <p className="mt-5 inline-flex items-center gap-2 text-xs text-secondary-ink">
            <Truck aria-hidden="true" className="h-4 w-4 text-primary" />
            Orders are tracked from the supplier in China to your address in Bangladesh.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
