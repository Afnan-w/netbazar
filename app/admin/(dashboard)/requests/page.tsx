import { Inbox } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getAdminRequests } from "@/lib/data/admin";
import { formatBDT } from "@/lib/utils/format";
import type { ProductRequestStatus } from "@/types/database";

const statuses: ProductRequestStatus[] = [
  "new",
  "contacted",
  "quoted",
  "paid",
  "shipped",
  "closed",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  all: "All",
  new: "New request",
  contacted: "Checking supplier",
  quoted: "Quote sent",
  paid: "Paid",
  shipped: "In transit",
  closed: "Delivered",
  cancelled: "Cancelled",
};

type RequestsPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

function parseStatus(value: string | string[] | undefined): ProductRequestStatus | "all" {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "all";
  return statuses.find((status) => status === raw) ?? "all";
}

export default async function AdminRequestsPage({ searchParams }: RequestsPageProps) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const requests = await getAdminRequests(status);

  const filterHref = (filter: ProductRequestStatus | "all") =>
    filter === "all" ? "/admin/requests" : `/admin/requests?status=${filter}`;

  return (
    <div>
      <PageHeader
        title="Sourcing requests"
        description="Check supplier availability, send quotes and move each request through to delivery."
      />

      <nav
        aria-label="Filter requests by status"
        className="mb-6 flex flex-wrap gap-2 rounded-card border border-border bg-surface p-2"
      >
        {(["all", ...statuses] as const).map((filter) => (
          <Link
            key={filter}
            href={filterHref(filter)}
            aria-current={filter === status ? "page" : undefined}
            className={`inline-flex min-h-9 items-center rounded-full px-3.5 text-xs font-semibold transition-colors ${
              filter === status
                ? "bg-primary text-white shadow-card"
                : "text-secondary-ink hover:bg-primary-tint hover:text-primary"
            }`}
          >
            {statusLabels[filter] ?? filter}
          </Link>
        ))}
      </nav>

      {requests.length === 0 ? (
        <div className="nova-panel px-6 py-14 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-control bg-primary-tint text-primary">
            <Inbox aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="mt-4 text-sm font-medium text-ink">
            No requests with this status yet.
          </p>
          <p className="mt-1 text-xs text-muted">
            Try another filter to see more requests.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id} className="nova-card nova-lift p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink">{request.name}</p>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{request.phone}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-secondary-ink">
                    {request.description}
                  </p>
                  {request.product_link && (
                    <p className="mt-1 truncate text-xs text-primary">
                      {request.product_link}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-secondary-ink">
                    <span>Qty {request.quantity}</span>
                    <span className="font-semibold text-ink">
                      {formatBDT(request.budget_bdt) || "No budget"}
                    </span>
                    <span>
                      Received{" "}
                      {new Date(request.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <ButtonLink
                  href={`/admin/requests/${request.id}`}
                  variant="secondary"
                  size="sm"
                  pill
                >
                  View
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
