import { MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { PaymentNote } from "@/components/store/payment-note";
import { RequestForm } from "@/components/store/request-form";

export const metadata: Metadata = {
  title: "Request a product",
  description:
    "Ask Netbazar to source a product from China that is not listed in the catalogue.",
};

const bullets = [
  "Tell us the product name, a link if you have one, quantity and your budget.",
  "Add your name, WhatsApp number and delivery address in Bangladesh.",
  "We check the supplier, then confirm the final price, shipping and delivery time on WhatsApp.",
];

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div className="nova-panel h-fit p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Sourcing request
          </span>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Request a product
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-secondary-ink">
            Can&apos;t find what you need? Send us the details and we will check
            whether our suppliers can source it for you.
          </p>
          <ul className="mt-7 space-y-4">
            {bullets.map((bullet, index) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-secondary-ink">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-tint text-xs font-bold text-primary">
                  {index + 1}
                </span>
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-card bg-lilac/30 p-1">
            <PaymentNote />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-secondary-ink">
            <MessageCircle aria-hidden="true" className="h-4 w-4 text-primary" />
            We usually reply on WhatsApp.
          </p>
        </div>

        <div className="rounded-panel bg-blush/20 p-2 sm:p-3">
          <RequestForm />
        </div>
      </div>
    </div>
  );
}
