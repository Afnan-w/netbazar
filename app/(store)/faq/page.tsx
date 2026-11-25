import { MessageCircle } from "lucide-react";
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
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Help
      </p>
      <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink/65">
        If your question is not here, message us on WhatsApp or use the product
        request form.
      </p>

      <div className="mt-10 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-surface px-5">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span aria-hidden="true" className="text-lg leading-none text-brand">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-xl bg-canvas p-6 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
        <p>Still need help? We are happy to answer on WhatsApp.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/request"
            className="rounded-full border border-ink/20 px-4 py-2 font-medium hover:border-brand hover:text-brand"
          >
            Request a product
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand px-4 py-2 font-medium text-brand hover:bg-mint"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
