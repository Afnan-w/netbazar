import { ArrowUpRight, Inbox, Package, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminOverview, getAdminRequests } from "@/lib/data/admin";
import { formatBDT } from "@/lib/utils/format";

export default async function AdminOverviewPage() {
  const [overview, recentRequests] = await Promise.all([
    getAdminOverview(),
    getAdminRequests("new"),
  ]);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A quick look at the catalogue and incoming product requests."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add product
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="rounded-3xl border border-ink/10 bg-surface p-6 transition-colors hover:border-brand/40"
        >
          <div className="flex items-center justify-between">
            <Package aria-hidden="true" className="h-5 w-5 text-brand" />
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-ink/35" />
          </div>
          <p className="mt-5 text-3xl font-light">{overview.productCount}</p>
          <p className="mt-1 text-sm text-ink/60">Products in the catalogue</p>
        </Link>
        <Link
          href="/admin/requests?status=new"
          className="rounded-3xl border border-ink/10 bg-surface p-6 transition-colors hover:border-brand/40"
        >
          <div className="flex items-center justify-between">
            <Inbox aria-hidden="true" className="h-5 w-5 text-brand" />
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-ink/35" />
          </div>
          <p className="mt-5 text-3xl font-light">{overview.newRequestCount}</p>
          <p className="mt-1 text-sm text-ink/60">New product requests</p>
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.75fr]">
        <section className="rounded-3xl border border-ink/10 bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium">Recent requests</h2>
            <Link href="/admin/requests" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <p className="mt-5 text-sm text-ink/55">
              No new requests yet. Submitted requests will appear here.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-ink/10">
              {recentRequests.slice(0, 5).map((request) => (
                <li key={request.id}>
                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-brand"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{request.name}</p>
                      <p className="mt-0.5 truncate text-xs text-ink/55">
                        {request.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm">{formatBDT(request.budget_bdt) || "No budget"}</p>
                      <p className="mt-0.5 text-xs text-ink/45">Qty {request.quantity}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-ink/10 bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-medium">Request pipeline</h2>
          <ul className="mt-5 space-y-2.5">
            {overview.requestsByStatus.map(({ status, count }) => (
              <li key={status} className="flex items-center justify-between gap-3">
                <StatusBadge status={status} />
                <span className="text-sm text-ink/70">{count}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-ink/10 pt-5">
            <Link
              href="/admin/categories"
              className="text-sm text-ink/65 hover:text-brand"
            >
              Manage categories →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
