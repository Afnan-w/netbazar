import { ArrowRight, Compass, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-lilac/40 to-page px-4 py-16">
      <div className="nova-panel w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-tint text-primary">
          <Compass aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          404
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          This page could not be found.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-secondary-ink">
          The link may be old, or the example may no longer be listed. Send us a
          photo or link and we&apos;ll source the item for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white pressable hover:bg-primary-hover active:bg-primary-active"
          >
            Go home
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-5 text-sm font-semibold text-primary pressable hover:bg-primary-tint"
          >
            <LayoutGrid aria-hidden="true" className="h-4 w-4" />
            See examples
          </Link>
        </div>
      </div>
    </main>
  );
}
