import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function Card({
  className = "",
  lift = false,
  ...props
}: ComponentPropsWithoutRef<"div"> & { lift?: boolean }) {
  return (
    <div
      className={`nova-card ${lift ? "nova-lift" : ""} ${className}`}
      {...props}
    />
  );
}

export function Panel({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={`nova-panel ${className}`} {...props} />;
}

export function CardHeader({
  title,
  action,
  className = "",
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      {title}
      {action}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-base font-bold tracking-tight text-ink ${className}`}>
      {children}
    </h2>
  );
}
