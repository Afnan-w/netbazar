"use client";

import {
  Bell,
  ChevronDown,
  FolderTree,
  Grid2X2,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Search,
  Settings,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import { ToastProvider } from "@/components/admin/toast";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonClass } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar, type SidebarItem } from "@/components/ui/sidebar";

const primaryItems: SidebarItem[] = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/requests", label: "Requests", icon: Inbox },
  { href: "/products?sort=price-asc", label: "Deals", icon: Tag, badge: "Hot" },
  { href: "/products?sort=newest", label: "New Arrivals", icon: TrendingUp },
  { href: "/products?featured=1", label: "Best Sellers", icon: Sparkles },
  { href: "/products", label: "Brands", icon: Grid2X2 },
  { href: "/products?view=grid", label: "Collections", icon: LayoutDashboard },
];

const accountItems: SidebarItem[] = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const topLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/requests", label: "Requests" },
];

const quickLinks = [
  { href: "/admin/products/new", label: "Add a product", icon: Package },
  { href: "/admin/requests?status=new", label: "New requests", icon: Inbox },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/admin"
      className="inline-flex min-h-11 items-center gap-2 rounded-control text-ink"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control hero-gradient text-white shadow-card">
        <Sparkles aria-hidden="true" className="h-4 w-4" />
      </span>
      <span
        className={`whitespace-nowrap text-lg font-bold tracking-tight ${
          compact ? "inline md:hidden lg:inline" : "hidden sm:inline"
        }`}
      >
        Net<span className="text-primary">bazar</span>
      </span>
      <span
        className={`rounded-badge bg-primary-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary ${
          compact ? "hidden lg:inline" : "hidden xl:inline"
        }`}
      >
        Admin
      </span>
    </Link>
  );
}

function RightRail() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Admin insights"
      className="sticky top-[96px] hidden h-fit w-[320px] shrink-0 space-y-4 xl:block"
    >
      <section className="nova-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-sage text-success">
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-card-title font-bold text-ink">Order channel: WhatsApp</h2>
            <p className="text-xs text-secondary-ink">Chat-first checkout</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-secondary-ink">
          Customers confirm availability, price and delivery details directly in
          chat. Keep your number current in site settings.
        </p>
        <Link
          href="/admin/settings"
          className={buttonClass({
            variant: "soft",
            size: "sm",
            className: "mt-4 w-full",
          })}
        >
          View WhatsApp settings
        </Link>
      </section>

      <section className="rounded-panel bg-primary-tint p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-surface text-primary shadow-card">
            <LifeBuoy aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-card-title font-bold text-ink">Need help?</h2>
            <p className="text-xs text-secondary-ink">Answers, policies and guides</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-secondary-ink">
          Find common answers about orders, delivery and product requests.
        </p>
        <Link
          href="/faq"
          className={buttonClass({
            variant: "secondary",
            size: "sm",
            className: "mt-4 w-full",
          })}
        >
          Visit help centre
        </Link>
      </section>

      <section className="nova-card p-5">
        <h2 className="text-card-title font-bold text-ink">Quick links</h2>
        <nav aria-label="Quick links" className="mt-3 space-y-1">
          {quickLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-11 items-center gap-3 rounded-control px-3 text-sm transition-colors ${
                  active
                    ? "bg-primary-tint font-semibold text-primary"
                    : "text-secondary-ink hover:bg-primary-tint hover:text-primary"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-xs font-medium text-secondary-ink">Appearance</span>
          <ThemeToggle />
        </div>
      </section>
    </aside>
  );
}

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (email.split("@")[0] ?? "A").slice(0, 1).toUpperCase() || "A";

  return (
    <ToastProvider>
      <div className="min-h-screen bg-page text-ink">
        <div className="relative z-50">
          <Sidebar
            logo={<Logo compact />}
            primaryItems={primaryItems}
            accountItems={accountItems}
            promo={{
              title: "Fresh drops sell faster",
              subtitle: "Add a new product to the catalogue today.",
              href: "/admin/products/new",
              label: "Add product",
            }}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          />
        </div>

        <div className="md:pl-24 lg:pl-64">
          <Navbar
            logo={
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-border bg-surface text-secondary-ink pressable hover:bg-primary-tint hover:text-primary md:hidden"
                  aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <Menu aria-hidden="true" className="h-5 w-5" />
                </button>
                <Logo />
              </div>
            }
            links={topLinks}
            search={
              <Link
                href="/admin/products"
                aria-label="Search products"
                className="flex min-h-11 items-center gap-3 rounded-control border border-border bg-page px-4 text-sm text-muted transition-colors hover:border-primary/30 hover:bg-surface hover:text-secondary-ink"
              >
                <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                <span className="hidden truncate sm:inline">
                  Search products by name or SKU…
                </span>
              </Link>
            }
            actions={
              <>
                <Link
                  href="/admin/requests"
                  aria-label="View product requests"
                  className="grid h-11 w-11 place-items-center rounded-control border border-border bg-surface text-secondary-ink transition-colors hover:border-primary/30 hover:bg-primary-tint hover:text-primary pressable"
                >
                  <Bell aria-hidden="true" className="h-5 w-5" />
                </Link>
                <details className="relative">
                  <summary
                    aria-label="Account menu"
                    className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-control border border-border bg-surface px-2 text-secondary-ink transition-colors hover:border-primary/30 hover:bg-primary-tint [&::-webkit-details-marker]:hidden"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-tint text-xs font-bold text-primary">
                      {initials}
                    </span>
                    <span className="hidden max-w-28 truncate text-xs font-medium sm:inline">
                      {email.split("@")[0] || "Admin"}
                    </span>
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                  </summary>
                  <div className="dropdown-pop absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-card border border-border bg-surface p-2 shadow-card-hover">
                    <p
                      className="truncate px-3 py-2 text-xs text-muted"
                      title={email || "Admin account"}
                    >
                      {email || "Admin account"}
                    </p>
                    <div className="my-1 border-t border-border" />
                    <Link
                      href="/admin/settings"
                      className="flex min-h-11 items-center gap-2 rounded-control px-3 text-sm text-secondary-ink hover:bg-primary-tint hover:text-primary"
                    >
                      <Settings aria-hidden="true" className="h-4 w-4" />
                      Settings
                    </Link>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-sm text-secondary-ink hover:bg-primary-tint hover:text-primary"
                      >
                        <LogOut aria-hidden="true" className="h-4 w-4" />
                        Sign out
                      </button>
                    </form>
                  </div>
                </details>
              </>
            }
            onOpenMenu={undefined}
          />

          <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
            <main className="min-w-0 flex-1">
              {children}
              <form
                action={signOut}
                className="mt-10 border-t border-border pt-5 md:hidden"
              >
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-secondary-ink hover:text-primary"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </main>
            <RightRail />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
