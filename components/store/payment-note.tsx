import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function PaymentNote({ children }: { children?: ReactNode }) {
  return (
    <aside className="flex gap-3 rounded-xl border border-brand/20 bg-mint/60 p-4 text-sm leading-relaxed text-ink/75">
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <div>
        <p className="font-medium text-ink">Before you pay</p>
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
