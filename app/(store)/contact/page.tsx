import { ArrowRight, Mail, MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PaymentNote } from "@/components/store/payment-note";
import { getSiteSettings } from "@/lib/data/store";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Netbazar on WhatsApp or email about products and orders.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I have a question about a product.",
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="nova-panel p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          Contact
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Talk to us before you order.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary-ink">
          WhatsApp is the fastest way to confirm availability, final price, shipping
          and delivery time. Email is available for general questions.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="nova-card nova-lift flex flex-col p-6"
        >
          <span className="grid h-11 w-11 place-items-center rounded-control bg-primary-tint text-primary">
            <MessageCircle aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-ink">WhatsApp</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
            Order a listed product, ask a question or follow up on a request.
          </p>
          <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-4 text-sm font-bold text-white pressable">
            Open WhatsApp
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </a>

        <div className="nova-card nova-lift p-6">
          <span className="grid h-11 w-11 place-items-center rounded-control bg-lilac text-primary">
            <Mail aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-ink">Email</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
            For general enquiries. Orders and confirmations are handled on WhatsApp.
          </p>
          {settings.contact_email ? (
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-5 inline-flex min-h-11 items-center rounded-control border border-border bg-surface px-4 text-sm font-semibold text-primary pressable hover:bg-primary-tint"
            >
              {settings.contact_email}
            </a>
          ) : (
            <p className="mt-5 text-sm text-muted">Email will be added soon.</p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-card bg-primary-tint/30 p-1">
        <PaymentNote />
      </div>

      <div className="nova-panel mt-8 flex flex-wrap items-center gap-2 bg-blush/25 p-6 text-sm text-secondary-ink">
        <span>Looking for an item that is not listed?</span>{" "}
        <Link
          href="/request"
          className="inline-flex min-h-11 items-center gap-1 font-bold text-primary hover:text-primary-hover"
        >
          Submit a product request
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <span>.</span>
      </div>
    </div>
  );
}
