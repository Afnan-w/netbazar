"use client";

import { LockKeyhole, Mail } from "lucide-react";
import { useActionState } from "react";
import { initialLoginState, signIn } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signIn,
    initialLoginState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-semibold text-secondary-ink">
          Email
        </label>
        <div className="flex min-h-11 items-center gap-3 rounded-control border border-border bg-surface px-3 transition-all focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/15">
          <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
            placeholder="owner@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-semibold text-secondary-ink">
          Password
        </label>
        <div className="flex min-h-11 items-center gap-3 rounded-control border border-border bg-surface px-3 transition-all focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/15">
          <LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-control bg-blush px-4 py-3 text-sm font-medium text-sale ring-1 ring-border"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
