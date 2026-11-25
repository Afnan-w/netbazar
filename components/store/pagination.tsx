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
          className="inline-flex h-9 items-center gap-1 rounded-full border border-ink/15 px-3 text-sm hover:border-brand hover:text-brand"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-ink/10 px-3 text-sm text-ink/30">
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </span>
      )}

      {pages.map((candidate, index) => (
        <span key={candidate} className="flex items-center gap-2">
          {index > 0 && pages[index - 1] !== candidate - 1 && (
            <span aria-hidden="true" className="px-1 text-ink/35">
              …
            </span>
          )}
          <Link
            href={buildHref(candidate)}
            aria-current={candidate === page ? "page" : undefined}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors ${
              candidate === page
                ? "border-brand bg-mint font-medium text-brand"
                : "border-ink/15 hover:border-brand hover:text-brand"
            }`}
          >
            {candidate}
          </Link>
        </span>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-full border border-ink/15 px-3 text-sm hover:border-brand hover:text-brand"
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-ink/10 px-3 text-sm text-ink/30">
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
