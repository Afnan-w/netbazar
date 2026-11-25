import { ArrowUpRight, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { SiteSettings } from "@/types/database";

const shopLinks = [
  { href: "/products", label: "All products" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/request", label: "Request a product" },
  { href: "/faq", label: "FAQ" },
];

const policyLinks = [
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/payment", label: "Payment" },
  { href: "/policies/refund", label: "Refund" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
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
              China to Bangladesh sourcing. Curated products, BDT pricing and WhatsApp ordering.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-badge bg-surface/80 px-3 py-2 text-xs text-secondary-ink shadow-card ring-1 ring-border/70">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Price, shipping and delivery confirmed first.
            </p>
          </div>

          <nav aria-label="Shop links">
            <h2 className="inline-flex min-h-11 items-center text-sm font-semibold text-ink">
              Shop
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-secondary-ink">
              {shopLinks.map((link) => (
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
                href={buildWhatsAppUrl(settings.whatsapp_number, "Hello Netbazar")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/20 bg-surface px-3 text-sm font-medium text-primary shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:shadow-card-hover pressable"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </a>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-secondary-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 text-primary" />
                  {settings.contact_email}
                </a>
              )}
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

        <div className="mt-8 flex flex-col gap-3 rounded-card border border-border/70 bg-surface/50 px-5 py-4 text-xs text-muted shadow-card sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Netbazar. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            China → Bangladesh · Verified suppliers · BDT pricing
          </p>
        </div>
      </div>
    </footer>
  );
}
