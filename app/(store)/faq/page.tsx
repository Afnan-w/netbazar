import { MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data/store";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering, payment, shipping and product requests at Netbazar.",
};

const faqs = [
  {
    question: "Is Netbazar a marketplace?",
    answer:
      "No. Netbazar picks products from Chinese suppliers and lists them here. Customers contact Netbazar on WhatsApp to order. There are no seller accounts, cart or online checkout.",
  },
  {
    question: "How do I order a listed product?",
    answer:
      "Open the product page and tap Order on WhatsApp. The message already includes the product name, SKU, price and page link. We then confirm availability, final price, shipping and delivery time.",
  },
  {
    question: "When should I pay?",
    answer:
      "Payment is upfront to Netbazar, but only after we have confirmed availability, the final price, shipping cost and delivery time with you on WhatsApp.",
  },
  {
    question: "How does delivery work?",
    answer:
      "After you pay, Netbazar pays the supplier. The supplier ships your order directly to your address in Bangladesh.",
  },
  {
    question: "Can I request an unlisted product?",
    answer:
      "Yes. Use the request a product form with a description or link, quantity, budget and delivery address. We will check with our suppliers and reply on WhatsApp.",
  },
  {
    question: "Are the listed prices final?",
    answer:
      "Listed prices are indicative in BDT. The final price, shipping and delivery time are confirmed on WhatsApp before you pay.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We agree on a payment method with you on WhatsApp before payment. See the payment policy page for the current placeholder details.",
  },
];

export default async function FaqPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I have a question.",
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="nova-panel p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          Help
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-secondary-ink">
          If your question is not here, message us on WhatsApp or use the product
          request form.
        </p>
      </div>

      <div className="nova-card mt-8 divide-y divide-border px-5 sm:px-6">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-primary-tint text-lg leading-none text-primary transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-secondary-ink">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="nova-panel mt-8 flex flex-col gap-4 bg-lilac/35 p-6 text-sm text-secondary-ink sm:flex-row sm:items-center sm:justify-between">
        <p>Still need help? We are happy to answer on WhatsApp.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/request"
            className="inline-flex min-h-11 items-center rounded-control border border-border bg-surface px-4 font-semibold text-primary pressable hover:bg-primary-tint"
          >
            Request a product
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-4 font-bold text-white pressable hover:bg-primary-hover active:bg-primary-active"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
