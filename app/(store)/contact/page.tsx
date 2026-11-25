import { Mail, MessageCircle } from "lucide-react";
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
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Contact
      </p>
      <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
        Talk to us before you order.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/65">
        WhatsApp is the fastest way to confirm availability, final price, shipping
        and delivery time. Email is available for general questions.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl border border-ink/10 p-6 transition-colors hover:border-brand/40"
        >
          <MessageCircle aria-hidden="true" className="h-6 w-6 text-brand" />
          <h2 className="mt-5 text-lg font-medium">WhatsApp</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            Order a listed product, ask a question or follow up on a request.
          </p>
          <span className="mt-5 inline-flex rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand">
            Open WhatsApp
          </span>
        </a>

        <div className="rounded-3xl border border-ink/10 p-6">
          <Mail aria-hidden="true" className="h-6 w-6 text-brand" />
          <h2 className="text-lg font-medium">Email</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            For general enquiries. Orders and confirmations are handled on WhatsApp.
          </p>
          {settings.contact_email ? (
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-5 inline-flex rounded-full border border-ink/20 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"
            >
              {settings.contact_email}
            </a>
          ) : (
            <p className="mt-5 text-sm text-ink/50">Email will be added soon.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <PaymentNote />
      </div>

      <div className="mt-8 text-sm text-ink/65">
        Looking for an item that is not listed?{" "}
        <Link href="/request" className="font-medium text-brand hover:underline">
          Submit a product request
        </Link>
        .
      </div>
    </div>
  );
}
