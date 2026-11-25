"use client";

import { LockKeyhole, Mail } from "lucide-react";
import { useActionState } from "react";
import {
  initialLoginState,
  signIn,
} from "@/app/admin/login/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signIn,
    initialLoginState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-ink/15 bg-surface px-3 focus-within:border-brand">
          <Mail aria-hidden="true" className="h-4 w-4 text-ink/40" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full bg-transparent px-1 py-2.5 text-sm outline-none"
            placeholder="owner@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-ink/15 bg-surface px-3 focus-within:border-brand">
          <LockKeyhole aria-hidden="true" className="h-4 w-4 text-ink/40" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full bg-transparent px-1 py-2.5 text-sm outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full border border-brand bg-brand px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
