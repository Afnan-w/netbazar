import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function Hero({
  eyebrow = "New Collection",
  title,
  description,
  primaryAction,
  secondaryAction,
  slides = 0,
  activeSlide = 0,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  primaryAction: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  slides?: number;
  activeSlide?: number;
  children?: ReactNode;
}) {
  return (
    <section className="hero-gradient relative overflow-hidden rounded-panel text-white shadow-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-blush/50 blur-3xl"
      />

      <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-14 lg:py-20">
        <div className="hero-enter">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
          <h1 className="mt-5 max-w-xl text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-[44px]">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
            {description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={primaryAction.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[var(--primary-active)] shadow-soft pressable hover:bg-white/90"
            >
              {primaryAction.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white pressable hover:bg-white/10"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>

          {slides > 1 && (
            <div className="mt-8 flex items-center gap-2" aria-label="Carousel position">
              {Array.from({ length: slides }).map((_, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full bg-white transition-all ${
                    index === activeSlide ? "w-7" : "w-1.5 opacity-60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {children && <div className="relative">{children}</div>}
      </div>
    </section>
  );
}
