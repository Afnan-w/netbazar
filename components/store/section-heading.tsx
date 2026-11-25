import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="inline-flex rounded-badge bg-primary-tint px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-xl text-sm text-secondary-ink">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary-tint px-4 text-sm font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/15 hover:shadow-card active:translate-y-0 pressable"
        >
          {action.label}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export function ProductGrid({ children }: { children: ReactNode }) {
  return (
    <div className="product-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
