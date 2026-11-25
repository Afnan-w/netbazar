import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
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
        title="Product requests"
        description="Customers who asked for items that are not listed yet. Contact them on WhatsApp."
      />

      <nav aria-label="Filter requests by status" className="mb-6 flex flex-wrap gap-2">
        {(["all", ...statuses] as const).map((filter) => (
          <Link
            key={filter}
            href={filterHref(filter)}
            className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
              filter === status
                ? "border-brand bg-mint font-medium text-brand"
                : "border-ink/15 text-ink/60 hover:border-brand hover:text-brand"
            }`}
          >
            {filter}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-surface">
        {requests.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/55">
            No requests with this status yet.
          </p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Customer</th>
                <th scope="col" className="px-5 py-3 font-medium">Requested item</th>
                <th scope="col" className="px-5 py-3 font-medium">Qty / budget</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium">Received</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-canvas/60">
                  <td className="px-5 py-4">
                    <p className="font-medium">{request.name}</p>
                    <p className="mt-0.5 text-xs text-ink/45">{request.phone}</p>
                  </td>
                  <td className="max-w-xs px-5 py-4">
                    <p className="truncate text-ink/75">{request.description}</p>
                    {request.product_link && (
                      <p className="mt-0.5 truncate text-xs text-brand">{request.product_link}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink/70">
                    {request.quantity}
                    <span className="mx-1.5 text-ink/30">·</span>
                    {formatBDT(request.budget_bdt) || "No budget"}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={request.status} /></td>
                  <td className="px-5 py-4 text-xs text-ink/55">
                    {new Date(request.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/requests/${request.id}`}
                      className="inline-flex rounded-full border border-ink/15 px-3 py-1.5 text-xs hover:border-brand hover:text-brand"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
