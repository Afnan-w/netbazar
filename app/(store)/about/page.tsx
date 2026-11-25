import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "How Netbazar sources products from China for customers in Bangladesh.",
};

const points = [
  {
    title: "Manual product selection",
    text: "The owner chooses products from Chinese suppliers and lists them here with prices in BDT.",
  },
  {
    title: "Confirmation on WhatsApp",
    text: "Orders start with a conversation. We confirm availability, final price, shipping and delivery time before payment.",
  },
  {
    title: "Payment upfront, direct delivery",
    text: "You pay Netbazar first. Netbazar pays the supplier, and the supplier ships directly to your address in Bangladesh.",
  },
  {
    title: "Requests are welcome",
    text: "If an item is not listed, send a product request and we will check whether we can source it.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="nova-panel p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          About Netbazar
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          China-to-Bangladesh sourcing, kept simple.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-secondary-ink">
          Netbazar is a small sourcing store, not a marketplace. We list a focused
          catalogue of products picked from Chinese suppliers and help customers in
          Bangladesh order them through WhatsApp.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {points.map((point, index) => (
          <div key={point.title} className="nova-card nova-lift p-6">
            <span className="grid h-10 w-10 place-items-center rounded-control bg-primary-tint text-sm font-bold text-primary">
              0{index + 1}
            </span>
            <h2 className="mt-4 text-base font-bold text-ink">{point.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary-ink">{point.text}</p>
          </div>
        ))}
      </div>

      <div className="nova-panel mt-8 bg-lilac/40 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-ink">Ready to start?</h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
          Browse the catalogue or tell us what you need. We will confirm the details
          on WhatsApp before any payment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-4 text-sm font-bold text-white pressable hover:bg-primary-hover active:bg-primary-active"
          >
            Browse products
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/request"
            className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-semibold text-primary pressable hover:bg-primary-tint"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Request a product
          </Link>
        </div>
      </div>
    </div>
  );
}
