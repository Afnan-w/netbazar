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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-semibold tracking-tight">
          Net<span className="text-accent">bazar</span>
        </Link>
        <div className="mt-8 rounded-xl border border-ink/10 bg-surface p-6 sm:p-8">
          <h1 className="text-2xl font-light tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            This area is for the Netbazar owner only.
          </p>
          {notice && (
            <p className="mt-5 rounded-xl bg-mint px-4 py-3 text-sm text-ink/70">
              {notice}
            </p>
          )}
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-ink/45">
          <Link href="/" className="hover:text-brand">
            Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
