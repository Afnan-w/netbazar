import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export function OrderSummary({
  promoPlaceholder = "Promo code",
  onApplyPromo,
  subtotal,
  discount,
  shipping,
  total,
  actionLabel,
  actionHref,
  accepted = ["Visa", "Mastercard", "PayPal", "Apple Pay", "GPay"],
}: {
  promoPlaceholder?: string;
  onApplyPromo?: () => void;
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  actionLabel: string;
  actionHref: string;
  accepted?: string[];
}) {
  return (
    <section className="nova-card p-5">
      <h2 className="text-base font-bold text-ink">Order Summary</h2>

      <div className="mt-4 flex gap-2">
        <input
          aria-label={promoPlaceholder}
          placeholder={promoPlaceholder}
          className="soft-input min-w-0 flex-1 text-xs"
        />
        <button
          type="button"
          onClick={onApplyPromo}
          className="shrink-0 rounded-control bg-primary px-3 text-xs font-bold text-white hover:bg-primary-hover"
        >
          Apply
        </button>
      </div>

      <dl className="mt-5 space-y-3 border-b border-border pb-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-secondary-ink">Subtotal</dt>
          <dd className="font-semibold text-ink">{subtotal}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-secondary-ink">Discount</dt>
          <dd className="font-semibold text-sale">{discount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-secondary-ink">Shipping</dt>
          <dd className="font-semibold text-success">{shipping}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-sm font-bold text-ink">Total</span>
        <span className="text-xl font-bold text-primary">{total}</span>
      </div>

      <Link
        href={actionHref}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control bg-primary font-bold text-white shadow-[0_8px_20px_-10px_rgba(108,79,214,0.75)] hover:bg-primary-hover"
      >
        <Lock aria-hidden="true" className="h-4 w-4" />
        {actionLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-4">
        <span className="text-[10px] font-semibold text-muted">We accept</span>
        {accepted.map((label) => (
          <span
            key={label}
            className="rounded-badge border border-border bg-[var(--image-backdrop)] px-2 py-1 text-[9px] font-bold text-secondary-ink"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
