import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  action,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={`mb-5 flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div>
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-[22px]">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-9 items-center rounded-full bg-[var(--image-backdrop)] px-3 text-xs font-semibold text-secondary-ink transition-colors hover:bg-primary-tint hover:text-primary"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
