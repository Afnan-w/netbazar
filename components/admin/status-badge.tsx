import type { ProductRequestStatus, ProductStatus } from "@/types/database";

const tones: Record<string, string> = {
  available: "border-brand/30 bg-mint text-brand",
  new: "border-brand/30 bg-mint text-brand",
  draft: "border-ink/15 bg-canvas text-ink/60",
  contacted: "border-ink/15 bg-canvas text-ink/60",
  quoted: "border-ink/15 bg-canvas text-ink/60",
  paid: "border-brand/30 bg-mint text-brand",
  shipped: "border-brand/30 bg-mint text-brand",
  closed: "border-ink/15 bg-canvas text-ink/60",
  unavailable: "border-amber-300 bg-amber-50 text-amber-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

export function StatusBadge({
  status,
}: {
  status: ProductRequestStatus | ProductStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${tones[status] ?? "border-ink/15 text-ink/60"}`}
    >
      {status}
    </span>
  );
}
