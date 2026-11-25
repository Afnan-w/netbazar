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
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        About Netbazar
      </p>
      <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
        China-to-Bangladesh sourcing, kept simple.
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/70">
        Netbazar is a small sourcing store, not a marketplace. We list a focused
        catalogue of products picked from Chinese suppliers and help customers in
        Bangladesh order them through WhatsApp.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {points.map((point) => (
          <div key={point.title} className="rounded-xl border border-ink/10 p-6">
            <h2 className="text-base font-medium">{point.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{point.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-canvas p-6">
        <h2 className="text-lg font-medium">Ready to start?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          Browse the catalogue or tell us what you need. We will confirm the details
          on WhatsApp before any payment.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/products"
            className="rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-mint"
          >
            Browse products
          </Link>
          <Link
            href="/request"
            className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"
          >
            Request a product
          </Link>
        </div>
      </div>
    </div>
  );
}
