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
        body: "After payment, Netbazar pays the supplier and the supplier ships directly to the customer. Add typical timelines here.",
      },
      {
        heading: "Shipping cost",
        body: "Shipping is confirmed on WhatsApp before payment. Add any fixed rates or calculation rules here.",
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
        body: "Customers pay Netbazar in advance. Netbazar then pays the supplier. We confirm the final price, shipping and delivery time on WhatsApp before payment.",
      },
      {
        heading: "Accepted methods",
        body: "List the payment methods you accept here. No online checkout or payment gateway is used.",
      },
      {
        heading: "Price confirmation",
        body: "Catalogue prices are indicative in BDT. The final quoted price is agreed in the WhatsApp conversation.",
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
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Policies
      </p>
      <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
        {policy.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink/60">{policy.intro}</p>

      <div className="mt-10 space-y-6">
        {policy.sections.map((section) => (
          <section key={section.heading} className="border-t border-ink/10 pt-6">
            <h2 className="text-lg font-medium">{section.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-canvas p-6 text-sm text-ink/65">
        Questions about this policy?{" "}
        <Link href="/contact" className="font-medium text-brand hover:underline">
          Contact us
        </Link>
        .
      </div>
    </div>
  );
}
