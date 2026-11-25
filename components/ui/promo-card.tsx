import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type PromoTone = "blush" | "sage" | "peach" | "lilac";

const toneClasses: Record<PromoTone, string> = {
  blush: "bg-blush",
  sage: "bg-sage",
  peach: "bg-peach",
  lilac: "bg-lilac",
};

export function PromoCard({
  tone,
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = "Shop now",
  countdown,
  children,
}: {
  tone: PromoTone;
  eyebrow?: string;
  title: string;
  subtitle: string;
  href: string;
  linkLabel?: string;
  countdown?: string;
  children?: ReactNode;
}) {
  return (
    <article
      className={`relative min-h-52 overflow-hidden rounded-card p-5 ${toneClasses[tone]}`}
    >
      <div className="relative z-10 max-w-[72%]">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-ink">
            {eyebrow}
          </p>
        )}
        <h3 className="mt-2 text-lg font-bold leading-tight text-ink">{title}</h3>
        <p className="mt-1.5 text-xs text-secondary-ink">{subtitle}</p>
        {countdown && (
          <span className="mt-3 inline-flex items-center gap-1" aria-label={`Countdown ${countdown}`}>
            {countdown.split(":").map((part, index) => (
              <span
                key={index}
                className="rounded-badge bg-white/90 px-2 py-1 text-xs font-bold tabular-nums text-ink shadow-soft"
              >
                {part}
              </span>
            ))}
          </span>
        )}
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children && (
        <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 opacity-90">
          {children}
        </div>
      )}
    </article>
  );
}
