import { ArrowUpRight, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getContactEmail } from "@/lib/utils/contact";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { SiteSettings } from "@/types/database";

const sourceLinks = [
  { href: "/products", label: "What we source" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/request", label: "Submit a product request" },
  { href: "/faq", label: "FAQ" },
];

const policyLinks = [
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/payment", label: "Payment" },
  { href: "/policies/refund", label: "Refund" },
];

export function SiteFooter({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: { name: string; slug: string }[];
}) {
  const email = getContactEmail(settings.contact_email);

  return (
    <footer className="mt-20 bg-lilac text-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-panel border border-border/70 bg-surface/60 p-6 shadow-card backdrop-blur-sm sm:p-8 md:grid-cols-4 md:gap-10 md:p-10">
          <div>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-ink transition-colors duration-200 hover:text-primary"
            >
              Net<span className="text-primary">bazar</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-secondary-ink">
              Show us what you want from China. We source it through trusted
              suppliers and deliver it to Bangladesh.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-badge bg-surface/80 px-3 py-2 text-xs text-secondary-ink shadow-card ring-1 ring-border/70">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Supplier checked. Quote confirmed before payment.
            </p>
          </div>

          <nav aria-label="Sourcing links">
            <h2 className="inline-flex min-h-11 items-center text-sm font-semibold text-ink">
              Sourcing
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-secondary-ink">
              {sourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex min-h-11 items-center gap-1 rounded-control px-2 transition-colors duration-200 hover:bg-surface hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Policy links">
            <h2 className="inline-flex min-h-11 items-center text-sm font-semibold text-ink">
              Policies
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-secondary-ink">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-control px-2 transition-colors duration-200 hover:bg-surface hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="inline-flex min-h-11 items-center text-sm font-semibold text-ink">
              Get in touch
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-secondary-ink">
              <a
                href={buildWhatsAppUrl(
                  settings.whatsapp_number,
                  "Hello Netbazar, I would like to ask about sourcing a product.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/20 bg-surface px-3 text-sm font-medium text-primary shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:shadow-card-hover pressable"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`mailto:${email}`}
                aria-label={`Email ${email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card"
              >
                <Mail aria-hidden="true" className="h-4 w-4 text-primary" />
                Email us
              </a>
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary hover:shadow-card"
                >
                  Facebook
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary hover:shadow-card"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <nav aria-label="Example categories" className="mt-6 rounded-card border border-border/70 bg-surface/50 p-4 shadow-card sm:p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Example categories
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-3 text-xs text-secondary-ink transition-colors duration-200 hover:border-primary hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        )}

        <div className="mt-8 flex flex-col gap-3 rounded-card border border-border/70 bg-surface/50 px-5 py-4 text-xs text-muted shadow-card sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Netbazar. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            China → Bangladesh · Supplier sourcing · Quote before payment
          </p>
        </div>
      </div>
    </footer>
  );
}
