import { Camera, ClipboardList, MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { PaymentNote } from "@/components/store/payment-note";
import { RequestForm } from "@/components/store/request-form";
import { getProductBySlug } from "@/lib/data/store";
import { absoluteProductUrl } from "@/lib/utils/product-url";

export const metadata: Metadata = {
  title: "Submit a product request",
  description:
    "Show Netbazar what you want from China — a photo, a link or a description — and we will check our suppliers and send you a full quote.",
};

const bullets = [
  "Paste a link from Alibaba, AliExpress, 1688, Taobao or any other store, or just describe the item. A photo helps — you can attach it when we continue on WhatsApp.",
  "Tell us the quantity and your target budget in BDT, plus where in Bangladesh it should be delivered.",
  "We check the supplier, then send a quote with unit price, shipping, total and delivery time.",
];

type RequestPageProps = {
  searchParams: Promise<{ item?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function RequestPage({ searchParams }: RequestPageProps) {
  const params = await searchParams;
  const requestedSlug = firstValue(params.item);
  const prefill = requestedSlug ? await getProductBySlug(requestedSlug) : undefined;
  const prefillLink = prefill ? absoluteProductUrl(prefill.slug) : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div className="nova-panel h-fit p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Product request
          </span>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Show us what you want from China.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-secondary-ink">
            We&apos;ll source it for you through trusted suppliers. One request is all
            it takes — no catalogue search and no cart required.
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
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-secondary-ink">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-page/60 px-3 py-1.5">
              <Camera aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Photos welcome
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-page/60 px-3 py-1.5">
              <ClipboardList aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              One clear quote
            </span>
          </div>
          <div className="mt-8 rounded-card bg-lilac/30 p-1">
            <PaymentNote />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-secondary-ink">
            <MessageCircle aria-hidden="true" className="h-4 w-4 text-primary" />
            We usually reply on WhatsApp.
          </p>
        </div>

        <div className="rounded-panel bg-blush/20 p-2 sm:p-3">
          <RequestForm
            defaultDescription={prefill ? `Please source ${prefill.name} for me.` : ""}
            defaultLink={prefillLink.startsWith("http") ? prefillLink : ""}
          />
        </div>
      </div>
    </div>
  );
}
