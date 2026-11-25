import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (candidate) =>
      candidate === 1 ||
      candidate === totalPages ||
      Math.abs(candidate - page) <= 1,
  );

  return (
    <nav aria-label="Products pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-surface px-4 text-sm text-secondary-ink shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary hover:shadow-card-hover active:translate-y-0 pressable"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-page/60 px-4 text-sm text-muted">
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </span>
      )}

      {pages.map((candidate, index) => (
        <span key={candidate} className="flex items-center gap-2">
          {index > 0 && pages[index - 1] !== candidate - 1 && (
            <span aria-hidden="true" className="px-1 text-muted">
              …
            </span>
          )}
          <Link
            href={buildHref(candidate)}
            aria-current={candidate === page ? "page" : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border text-sm transition-all duration-200 hover:-translate-y-0.5 pressable ${
              candidate === page
                ? "border-primary bg-primary font-medium text-white shadow-card"
                : "border-border bg-surface text-secondary-ink shadow-card hover:border-primary hover:bg-primary-tint hover:text-primary hover:shadow-card-hover active:translate-y-0"
            }`}
          >
            {candidate}
          </Link>
        </span>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-surface px-4 text-sm text-secondary-ink shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-tint hover:text-primary hover:shadow-card-hover active:translate-y-0 pressable"
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-page/60 px-4 text-sm text-muted">
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
