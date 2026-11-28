import { FileText, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const policies = {
  shipping: {
    title: "Shipping policy",
    intro: "Placeholder text — replace with your final shipping policy before launch.",
    sections: [
      {
        heading: "Where we deliver",
        body: "Orders are delivered to addresses in Bangladesh. Add the areas you serve here.",
      },
      {
        heading: "How delivery works",
        body: "After you accept the quote and pay, Netbazar coordinates with the supplier and the supplier ships directly to your address in Bangladesh. Add typical timelines here.",
      },
      {
        heading: "Shipping cost",
        body: "Shipping to Bangladesh is included in your quote and confirmed on WhatsApp before payment. Add any fixed rates or calculation rules here.",
      },
    ],
  },
  payment: {
    title: "Payment policy",
    intro:
      "Placeholder text — replace with your final payment policy before launch.",
    sections: [
      {
        heading: "Payment is upfront",
        body: "Customers pay Netbazar only after accepting a quote. Netbazar then pays the supplier. We confirm the final price, shipping and delivery time on WhatsApp before payment.",
      },
      {
        heading: "Accepted methods",
        body: "List the payment methods you accept here. No online checkout or payment gateway is used.",
      },
      {
        heading: "Price confirmation",
        body: "Prices shown on sourcing examples are indicative in BDT. Your final quoted price is agreed in the WhatsApp conversation before payment.",
      },
    ],
  },
  refund: {
    title: "Refund policy",
    intro: "Placeholder text — replace with your final refund policy before launch.",
    sections: [
      {
        heading: "Damaged or incorrect items",
        body: "Explain what customers should do if an item arrives damaged or incorrect, including how to contact us on WhatsApp.",
      },
      {
        heading: "Refund conditions",
        body: "Add your conditions, timeframes and process for refunds here.",
      },
      {
        heading: "Contact",
        body: "All refund requests start with a WhatsApp message to Netbazar. Add your contact details here.",
      },
    ],
  },
} as const;

type PolicySlug = keyof typeof policies;
type PolicyPageProps = { params: Promise<{ slug: string }> };

function isPolicySlug(slug: string): slug is PolicySlug {
  return slug in policies;
}

export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isPolicySlug(slug)) return { title: "Page not found" };
  return {
    title: policies[slug].title,
    description: policies[slug].intro,
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) notFound();
  const policy = policies[slug];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="nova-panel p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-badge bg-primary-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          Policies
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {policy.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-secondary-ink">{policy.intro}</p>
      </div>

      <div className="mt-8 space-y-4">
        {policy.sections.map((section, index) => (
          <section key={section.heading} className="nova-card relative overflow-hidden p-6">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-primary/50" />
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-primary-tint text-primary">
                <FileText aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">
                  <span className="mr-2 text-xs font-bold tabular-nums text-primary">
                    0{index + 1}
                  </span>
                  {section.heading}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-secondary-ink">{section.body}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="nova-panel mt-8 bg-blush/25 p-6 text-sm text-secondary-ink">
        Questions about this policy?{" "}
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center font-bold text-primary hover:text-primary-hover"
        >
          Contact us
        </Link>
        .
      </div>
    </div>
  );
}
