import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { SiteSettings } from "@/types/database";

const shopLinks = [
  { href: "/products", label: "All products" },
  { href: "/request", label: "Request a product" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const policyLinks = [
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/payment", label: "Payment" },
  { href: "/policies/refund", label: "Refund" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              net<span className="text-brand">bazar</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/65">
              Products picked from Chinese suppliers and sourced for customers in
              Bangladesh. Order and confirm on WhatsApp.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-ink/50">
              Payment is upfront. Final price, shipping and delivery time are
              confirmed before payment.
            </p>
          </div>

          <nav aria-label="Shop links">
            <h2 className="text-sm font-semibold">Shop</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink/65">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Policy links">
            <h2 className="text-sm font-semibold">Policies</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink/65">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Get in touch</h2>
            <div className="mt-4 space-y-3 text-sm text-ink/65">
              <a
                href={buildWhatsAppUrl(settings.whatsapp_number, "Hello Netbazar")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-brand"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </a>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex items-center gap-2 hover:text-brand"
                >
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  {settings.contact_email}
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-brand"
                >
                  Facebook
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-brand"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink/10 pt-6 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Netbazar. All rights reserved.</p>
          <p>China to Bangladesh sourcing, simplified.</p>
        </div>
      </div>
    </footer>
  );
}
