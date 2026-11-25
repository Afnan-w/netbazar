import type { ComponentPropsWithRef, ReactNode } from "react";

const base =
  "soft-input w-full text-sm placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60";

export function Input({
  className = "",
  ...props
}: ComponentPropsWithRef<"input">) {
  return <input className={`${base} ${className}`} {...props} />;
}

export function Select({
  className = "",
  ...props
}: ComponentPropsWithRef<"select">) {
  return <select className={`${base} cursor-pointer pr-8 ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: ComponentPropsWithRef<"textarea">) {
  return (
    <textarea
      className={`${base} min-h-24 h-auto py-3 ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-semibold text-secondary-ink"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
