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
    <footer className="mt-20 bg-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Net<span className="text-highlight">bazar</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
              China to Bangladesh sourcing. Curated products, BDT pricing and WhatsApp ordering.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-white/55">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-highlight" />
              Price, shipping and delivery confirmed first.
            </p>
          </div>

          <nav aria-label="Shop links">
            <h2 className="text-sm font-semibold">Shop</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 hover:text-highlight">
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Policy links">
            <h2 className="text-sm font-semibold">Policies</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-highlight">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Get in touch</h2>
            <div className="mt-4 space-y-3 text-sm text-white/65">
              <a
                href={buildWhatsAppUrl(settings.whatsapp_number, "Hello Netbazar")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-highlight"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </a>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex items-center gap-2 hover:text-highlight"
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
                  className="block hover:text-highlight"
                >
                  Facebook
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-highlight"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Netbazar. All rights reserved.</p>
          <p>China → Bangladesh · Verified suppliers · BDT pricing</p>
        </div>
      </div>
    </footer>
  );
}
