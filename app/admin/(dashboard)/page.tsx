import { ArrowUpRight, Inbox, Package, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getAdminOverview, getAdminRequests } from "@/lib/data/admin";
import { formatBDT } from "@/lib/utils/format";

export default async function AdminOverviewPage() {
  const [overview, recentRequests] = await Promise.all([
    getAdminOverview(),
    getAdminRequests("new"),
  ]);

  const totalRequests = overview.requestsByStatus.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Incoming sourcing requests and the examples your customers can see."
        action={
          <ButtonLink href="/admin/requests?status=new" pill>
            <Plus aria-hidden="true" className="h-4 w-4" />
            Review new requests
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="nova-card nova-lift group p-6"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-control bg-primary-tint text-primary">
              <Package aria-hidden="true" className="h-5 w-5" />
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 text-muted transition-colors group-hover:text-primary"
            />
          </div>
          <p className="mt-6 text-3xl font-bold tracking-tight text-ink">
            {overview.productCount}
          </p>
          <p className="mt-1 text-sm text-secondary-ink">
            Sourcing examples on the site
          </p>
        </Link>
        <Link
          href="/admin/requests?status=new"
          className="nova-card nova-lift group p-6"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-control bg-peach text-primary">
              <Inbox aria-hidden="true" className="h-5 w-5" />
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 text-muted transition-colors group-hover:text-primary"
            />
          </div>
          <p className="mt-6 text-3xl font-bold tracking-tight text-ink">
            {overview.newRequestCount}
          </p>
          <p className="mt-1 text-sm text-secondary-ink">
            New sourcing requests
          </p>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.5fr_0.9fr]">
        <section className="nova-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-ink">Recent requests</h2>
              <p className="mt-1 text-xs text-muted">
                Latest requests waiting for a supplier check
              </p>
            </div>
            <Link
              href="/admin/requests"
              className="rounded-control px-2 py-1 text-sm font-medium text-primary hover:bg-primary-tint"
            >
              View all
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="mt-5 rounded-card border border-dashed border-border bg-page/60 px-6 py-10 text-center">
              <Inbox aria-hidden="true" className="mx-auto h-6 w-6 text-muted" />
              <p className="mt-3 text-sm text-secondary-ink">
                No new requests yet. Submitted sourcing requests will appear here.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-2">
              {recentRequests.slice(0, 5).map((request) => (
                <li key={request.id}>
                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="flex items-center justify-between gap-4 rounded-control border border-border bg-page/50 p-3.5 transition-colors hover:border-primary/30 hover:bg-primary-tint"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {request.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {request.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-ink">
                        {formatBDT(request.budget_bdt) || "No budget"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        Qty {request.quantity}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="nova-panel p-5 sm:p-6">
          <h2 className="text-base font-bold text-ink">Quote pipeline</h2>
          <p className="mt-1 text-xs text-muted">Every request by current stage</p>
          <ul className="mt-5 space-y-4">
            {overview.requestsByStatus.map(({ status, count }) => {
              const percent =
                totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
              return (
                <li key={status}>
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge status={status} />
                    <span className="text-sm font-semibold text-secondary-ink">
                      {count}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-image-backdrop">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t border-border pt-5">
            <Link
              href="/admin/categories"
              className="inline-flex min-h-11 items-center rounded-control px-2 text-sm font-medium text-secondary-ink hover:bg-primary-tint hover:text-primary"
            >
              Manage categories →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
