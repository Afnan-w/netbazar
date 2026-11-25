"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-tint/30 to-page px-4 py-16">
      <div className="nova-panel w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-primary">
          <AlertCircle aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h1 className="mt-5 text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Something went wrong.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary-ink">
          Please try again. If the problem continues, message us on WhatsApp and we
          will help.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white pressable hover:bg-primary-hover active:bg-primary-active"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Try again
        </button>
      </div>
    </main>
  );
}
