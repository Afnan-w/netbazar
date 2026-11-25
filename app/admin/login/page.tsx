import { PackageCheck, ShoppingBag, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const notice =
    params.error === "not-admin"
      ? "That account is not registered as an admin."
      : params.next
        ? "Sign in with an admin account to continue."
        : "";

  return (
    <div className="grid min-h-screen items-center gap-8 bg-page px-4 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12">
      <section className="hero-gradient relative overflow-hidden rounded-panel p-8 text-white shadow-card sm:p-12">
        <div
          aria-hidden="true"
          className="animate-glow-soft pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-soft pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-lilac/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full border border-white/30"
        />

        <div className="relative flex min-h-[360px] flex-col justify-between gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-badge bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Owner workspace
            </span>
            <h2 className="mt-7 max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-display">
              Your whole store, beautifully in one place.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
              Manage the catalogue, organise categories and follow up on product
              requests — all from one calm dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: PackageCheck, label: "Catalogue" },
              { icon: ShoppingBag, label: "Requests" },
              { icon: Sparkles, label: "Insights" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-card border border-white/25 bg-white/10 p-4 backdrop-blur-sm"
              >
                <span className="grid h-9 w-9 place-items-center rounded-control bg-white/20">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="block text-center text-2xl font-bold tracking-tight text-ink"
          >
            Net<span className="text-primary">bazar</span>
          </Link>

          <div className="nova-panel mt-8 p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Welcome back
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
              Admin sign in
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-secondary-ink">
              This area is for the Netbazar owner only.
            </p>
            {notice && (
              <p
                role="status"
                className="mt-5 rounded-control bg-primary-tint px-4 py-3 text-sm font-medium text-primary ring-1 ring-border"
              >
                {notice}
              </p>
            )}
            <div className="mt-7">
              <LoginForm />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            <Link
              href="/"
              className="rounded-control px-2 py-1 font-medium text-secondary-ink hover:bg-primary-tint hover:text-primary"
            >
              ← Back to storefront
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
