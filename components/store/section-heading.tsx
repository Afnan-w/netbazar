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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex w-fit items-center rounded-full border border-ink/20 px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ProductGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
