import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  tone = "lilac",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  tone?: "blush" | "sage" | "peach" | "lilac";
}) {
  const tones = {
    blush: "bg-blush",
    sage: "bg-sage",
    peach: "bg-peach",
    lilac: "bg-lilac",
  };

  return (
    <div className="nova-card flex flex-col items-center px-6 py-14 text-center">
      <span
        className={`grid h-20 w-20 place-items-center rounded-full ${tones[tone]}`}
      >
        <Icon aria-hidden="true" className="h-8 w-8 text-primary" strokeWidth={1.5} />
      </span>
      <h2 className="mt-5 text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-secondary-ink">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover"
      >
        {actionLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}
