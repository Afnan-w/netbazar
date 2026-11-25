import { Crown, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function ClubBanner({
  title = "Join Club",
  description = "Early access, member picks and WhatsApp-first support.",
  href = "/products",
  label = "Join",
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="hero-gradient relative overflow-hidden rounded-card p-5 text-white shadow-card">
      <div
        aria-hidden="true"
        className="absolute -right-4 top-2 grid h-24 w-24 place-items-center rounded-full bg-white/15 blur-sm"
      >
        <Crown className="h-10 w-10 text-white/70" strokeWidth={1.5} />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-2 right-10 grid h-16 w-16 place-items-center rounded-full bg-white/15"
      >
        <ShoppingBag className="h-7 w-7 text-white/70" strokeWidth={1.5} />
      </div>
      <div className="relative max-w-[75%]">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="mt-1 text-xs text-white/85">{description}</p>
        <Link
          href={href}
          className="mt-3 inline-flex min-h-9 items-center rounded-full bg-white px-4 text-xs font-bold text-primary-active hover:bg-white/90"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
