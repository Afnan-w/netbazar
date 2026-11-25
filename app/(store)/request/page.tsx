import type { Metadata } from "next";
import { RequestForm } from "@/components/store/request-form";
import { PaymentNote } from "@/components/store/payment-note";

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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Sourcing request
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Request a product
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Can&apos;t find what you need? Send us the details and we will check
            whether our suppliers can source it for you.
          </p>
          <ul className="mt-7 space-y-4">
            {bullets.map((bullet, index) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-medium text-brand">
                  {index + 1}
                </span>
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <PaymentNote />
          </div>
        </div>

        <RequestForm />
      </div>
    </div>
  );
}
