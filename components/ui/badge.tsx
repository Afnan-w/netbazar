import type { ReactNode } from "react";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "sale"
  | "hot"
  | "new"
  | "success"
  | "pending"
  | "cancelled";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--image-backdrop)] text-secondary-ink",
  primary: "bg-primary-tint text-primary",
  sale: "bg-sale text-white",
  hot: "bg-sale text-white",
  new: "bg-primary-tint text-primary",
  success: "badge-success",
  pending: "badge-pending",
  cancelled: "badge-cancelled",
};

export function Badge({
  variant = "neutral",
  pill = false,
  className = "",
  children,
}: {
  variant?: BadgeVariant;
  pill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-badge px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
        pill ? "rounded-full" : ""
      } ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
