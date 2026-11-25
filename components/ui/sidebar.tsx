"use client";

import { ChevronRight, LifeBuoy, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

function NavGroup({
  items,
  pathname,
  onNavigate,
}: {
  items: SidebarItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {items.map(({ label, href, icon: Icon, badge }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={label}
            className={`flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-white shadow-[0_8px_18px_-10px_rgba(108,79,214,0.8)]"
                : "text-secondary-ink hover:bg-primary-tint hover:text-primary"
            }`}
          >
            <Icon
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
              strokeWidth={1.5}
            />
            <span className="hidden truncate lg:inline">{label}</span>
            {badge && (
              <span className="ml-auto hidden rounded-full bg-sale px-2 py-0.5 text-[10px] font-bold text-white lg:inline">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  logo,
  primaryItems,
  accountItems,
  promo,
  open = false,
  onClose,
}: {
  logo: ReactNode;
  primaryItems: SidebarItem[];
  accountItems?: SidebarItem[];
  promo?: { title: string; subtitle: string; href: string; label: string };
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const content = (mobile = false) => (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between px-1 pb-5">
        {logo}
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid h-10 w-10 place-items-center rounded-control text-secondary-ink hover:bg-primary-tint"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </div>

      <NavGroup
        items={primaryItems}
        pathname={pathname}
        onNavigate={mobile ? onClose : undefined}
      />

      {accountItems && accountItems.length > 0 && (
        <>
          <div className="my-4 border-t border-border" />
          <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted lg:block">
            Account
          </p>
          <NavGroup
            items={accountItems}
            pathname={pathname}
            onNavigate={mobile ? onClose : undefined}
          />
        </>
      )}

      <div className="mt-auto space-y-3 pt-5">
        {promo && (
          <div className="hero-gradient hidden rounded-card p-4 text-white lg:block">
            <p className="text-sm font-bold">{promo.title}</p>
            <p className="mt-1 text-xs text-white/85">{promo.subtitle}</p>
            <Link
              href={promo.href}
              onClick={mobile ? onClose : undefined}
              className="mt-3 inline-flex min-h-9 items-center gap-1 rounded-full bg-white px-3 text-xs font-bold text-primary-active"
            >
              {promo.label}
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div className="hidden items-center gap-2 rounded-control bg-primary-tint p-3 lg:flex">
          <LifeBuoy aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-ink">Need Help?</p>
            <p className="text-[11px] text-secondary-ink">24/7 Support</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-20 overflow-y-auto rounded-panel border border-border bg-surface shadow-card md:block lg:w-60">
        {content()}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <aside className="dropdown-pop absolute inset-y-0 left-0 w-[min(320px,86vw)] overflow-y-auto rounded-r-panel border-r border-border bg-surface shadow-card-hover">
            {content(true)}
          </aside>
        </div>
      )}
    </>
  );
}
