"use client";

import {
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import { ToastProvider } from "@/components/admin/toast";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/requests", label: "Requests", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas">
        <header className="border-b border-ink/10 bg-surface lg:hidden">
          <div className="flex h-16 items-center gap-3 px-4">
            <Link href="/admin" className="font-semibold tracking-tight">
              net<span className="text-brand">bazar</span> admin
            </Link>
            <button
              type="button"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15"
              aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
          {menuOpen && (
            <nav aria-label="Admin navigation" className="border-t border-ink/10 px-4 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2 text-sm ${
                    pathname === link.href
                      ? "bg-mint font-medium text-brand"
                      : "text-ink/70 hover:bg-canvas"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </header>

        <div className="mx-auto flex max-w-[1600px]">
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-ink/10 bg-surface px-4 py-6 lg:block">
            <Link href="/admin" className="px-2 text-lg font-semibold tracking-tight">
              net<span className="text-brand">bazar</span>
              <span className="ml-2 text-xs font-normal text-ink/40">admin</span>
            </Link>
            <nav aria-label="Admin navigation" className="mt-8 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    pathname === link.href ||
                    (link.href !== "/admin" && pathname.startsWith(link.href))
                      ? "bg-mint font-medium text-brand"
                      : "text-ink/65 hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <link.icon aria-hidden="true" className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-6 left-4 right-4 border-t border-ink/10 pt-4">
              <p className="truncate px-2 text-xs text-ink/50" title={email}>
                {email}
              </p>
              <form action={signOut} className="mt-2">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink/65 hover:bg-canvas hover:text-ink"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </aside>

          <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
            {children}
            <form action={signOut} className="mt-12 border-t border-ink/10 pt-6 lg:hidden">
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-brand"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
