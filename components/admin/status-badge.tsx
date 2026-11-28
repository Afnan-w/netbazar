import type { ProductRequestStatus, ProductStatus } from "@/types/database";

const labels: Record<string, string> = {
  new: "New request",
  contacted: "Checking supplier",
  quoted: "Quote sent",
  paid: "Paid",
  shipped: "In transit",
  closed: "Delivered",
  cancelled: "Cancelled",
  available: "Ready to source",
  draft: "Draft",
  unavailable: "Not available",
};

const tones: Record<string, string> = {
  available: "badge-success",
  paid: "badge-success",
  shipped: "badge-success",
  closed: "badge-success",
  new: "badge-pending",
  contacted: "badge-pending",
  quoted: "badge-pending",
  draft: "bg-image-backdrop text-secondary-ink",
  unavailable: "bg-image-backdrop text-secondary-ink",
  cancelled: "badge-cancelled",
};

export function StatusBadge({
  status,
}: {
  status: ProductRequestStatus | ProductStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-border ${
        tones[status] ?? "bg-image-backdrop text-secondary-ink"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
