"use client";

import { AlertCircle } from "lucide-react";
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
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <AlertCircle aria-hidden="true" className="mx-auto h-9 w-9 text-brand" />
        <h1 className="mt-5 text-2xl font-light tracking-tight sm:text-3xl">
          Something went wrong.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          Please try again. If the problem continues, message us on WhatsApp and we
          will help.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 rounded-full border border-brand bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
