import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          404
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
          This page could not be found.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          The link may be old, or the product may no longer be listed. Browse the
          catalogue or ask us about an item on WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-brand bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
          >
            Browse products
          </Link>
        </div>
      </div>
    </main>
  );
}
