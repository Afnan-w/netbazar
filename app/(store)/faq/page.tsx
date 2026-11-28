import { MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data/store";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about sourcing products from China, quotes, payment and delivery with Netbazar.",
};

const faqs = [
  {
    question: "What exactly does Netbazar do?",
    answer:
      "We are a sourcing and matching service, not a marketplace. You show us an item you want from China — on Alibaba, AliExpress, 1688, Taobao or anywhere else — and we check our trusted supplier, send you a quote, and connect you with the supplier once you accept.",
  },
  {
    question: "How do I ask you to source something?",
    answer:
      "Submit a product request with a photo, a link or a description, plus quantity, budget and your delivery address in Bangladesh. If you already have photos, you can send them when we continue on WhatsApp.",
  },
  {
    question: "What does your quote include?",
    answer:
      "Your quote shows the unit price, shipping, total cost in BDT and the delivery time. We send it only after checking the supplier, and you decide whether to accept it.",
  },
  {
    question: "When should I pay?",
    answer:
      "Only after you accept the quote. We confirm availability, the final price, shipping and delivery time with you on WhatsApp first.",
  },
  {
    question: "How does delivery work?",
    answer:
      "After you accept and pay, we coordinate with the supplier. The supplier ships directly to your address in Bangladesh and we track the order until delivery.",
  },
  {
    question: "Do you only source items shown on this site?",
    answer:
      "No. The items here are examples of what we can source. Almost anything available from a Chinese supplier can be requested — just send us the details.",
  },
  {
    question: "Are the displayed prices final?",
    answer:
      "No. Prices shown on example items are indicative only. Your actual unit price, shipping and delivery time are confirmed in your quote before payment.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We agree on a payment method with you on WhatsApp before payment. See the payment policy page for the current details.",
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
          If your question is not here, message us on WhatsApp or submit a
          product request.
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
