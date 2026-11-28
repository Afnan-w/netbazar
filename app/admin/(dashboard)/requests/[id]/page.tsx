import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { RequestUpdateForm } from "@/components/admin/request-update-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonClass } from "@/components/ui/button";
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
    `Hello ${request.name}, thanks for your Netbazar sourcing request for: ${request.description}. I am checking with our supplier and will send you a quote with unit price, shipping and delivery time shortly.`,
  );

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: request.name },
    { label: "Phone", value: request.phone },
    { label: "Item wanted", value: request.description },
    { label: "Quantity", value: String(request.quantity) },
    { label: "Budget", value: formatBDT(request.budget_bdt) || "Not specified" },
    { label: "Delivery address", value: request.address },
    { label: "Received", value: new Date(request.created_at).toLocaleString("en-GB") },
  ];

  return (
    <div>
      <Link
        href="/admin/requests"
        className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm font-medium text-secondary-ink hover:bg-primary-tint hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to requests
      </Link>

      <div className="mt-5">
        <PageHeader
          title="Request details"
          description={`Submitted ${new Date(request.created_at).toLocaleString("en-GB")}`}
          action={
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ pill: true })}
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Send quote on WhatsApp
            </a>
          }
        />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
        <section className="nova-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-bold text-ink">Customer submission</h2>
            <StatusBadge status={request.status} />
          </div>
          <dl className="mt-5 divide-y divide-border overflow-hidden rounded-card border border-border bg-page/50">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[110px_1fr] gap-4 px-4 py-3 text-sm sm:grid-cols-[140px_1fr]"
              >
                <dt className="text-xs font-medium text-muted">{row.label}</dt>
                <dd className="whitespace-pre-wrap break-words text-ink">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          {request.product_link && (
            <a
              href={request.product_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm font-medium text-primary hover:bg-primary-tint"
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
