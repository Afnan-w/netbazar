import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { RequestUpdateForm } from "@/components/admin/request-update-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminRequest } from "@/lib/data/admin";
import { formatBDT } from "@/lib/utils/format";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

type RequestDetailPageProps = { params: Promise<{ id: string }> };

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params;
  const request = await getAdminRequest(id);
  if (!request) notFound();

  const whatsappUrl = buildWhatsAppUrl(
    request.phone,
    `Hello ${request.name}, I am following up on your Netbazar product request: ${request.description}`,
  );

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: request.name },
    { label: "Phone", value: request.phone },
    { label: "Requested item", value: request.description },
    { label: "Quantity", value: String(request.quantity) },
    { label: "Budget", value: formatBDT(request.budget_bdt) || "Not specified" },
    { label: "Delivery address", value: request.address },
    { label: "Received", value: new Date(request.created_at).toLocaleString("en-GB") },
  ];

  return (
    <div>
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-2 text-sm text-ink/55 hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to requests
      </Link>

      <div className="mt-6">
        <PageHeader
          title="Request details"
          description={`Submitted ${new Date(request.created_at).toLocaleString("en-GB")}`}
          action={
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Message customer
            </a>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">Customer submission</h2>
            <StatusBadge status={request.status} />
          </div>
          <dl className="mt-5 divide-y divide-ink/10 rounded-2xl border border-ink/10">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[120px_1fr] gap-4 px-4 py-3 text-sm"
              >
                <dt className="text-ink/50">{row.label}</dt>
                <dd className="whitespace-pre-wrap break-words text-ink/80">{row.value}</dd>
              </div>
            ))}
          </dl>
          {request.product_link && (
            <a
              href={request.product_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-brand hover:underline"
            >
              Open product link
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </section>

        <RequestUpdateForm request={request} />
      </div>
    </div>
  );
}
