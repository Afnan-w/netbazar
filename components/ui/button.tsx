import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "soft"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_8px_20px_-10px_rgba(108,79,214,0.75)] hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "border border-border bg-surface text-ink hover:border-primary/30 hover:bg-primary-tint",
  soft: "bg-primary-tint text-primary hover:brightness-95",
  ghost: "text-secondary-ink hover:bg-primary-tint hover:text-primary",
  danger: "bg-sale text-white hover:brightness-95",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-sm",
  icon: "h-10 w-10",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  pill = false,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  className?: string;
} = {}) {
  return `inline-flex items-center justify-center gap-2 font-semibold pressable ${
    pill ? "rounded-full" : "rounded-control"
  } ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
};

export function Button({
  variant,
  size,
  pill,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, pill, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
};

export function ButtonLink({
  variant,
  size,
  pill,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClass({ variant, size, pill, className })}
      {...props}
    />
  );
}
