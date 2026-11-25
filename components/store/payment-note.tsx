import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function PaymentNote({ children }: { children?: ReactNode }) {
  return (
    <aside className="flex gap-3 rounded-card border border-primary/15 bg-primary-tint p-4 text-sm leading-relaxed text-secondary-ink shadow-card">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-surface text-primary shadow-card">
        <Info aria-hidden="true" className="h-4 w-4" />
      </span>
      <div>
        <p className="font-semibold text-ink">Before you pay</p>
        {children ?? (
          <p className="mt-1">
            Payment is upfront to Netbazar. We confirm availability, the final
            price, shipping and delivery time on WhatsApp before payment.
          </p>
        )}
      </div>
    </aside>
  );
}
