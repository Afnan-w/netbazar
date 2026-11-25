"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Navbar({
  logo,
  links,
  search,
  actions,
  onOpenMenu,
}: {
  logo: ReactNode;
  links: { href: string; label: string }[];
  search?: ReactNode;
  actions?: ReactNode;
  onOpenMenu?: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-border bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-control text-secondary-ink hover:bg-primary-tint lg:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        )}

        {logo}

        <nav
          aria-label="Primary navigation"
          className="ml-4 hidden items-center gap-1 xl:flex"
        >
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-tint text-primary"
                    : "text-secondary-ink hover:bg-primary-tint hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {search && <div className="mx-auto w-full max-w-xl">{search}</div>}

        <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}
