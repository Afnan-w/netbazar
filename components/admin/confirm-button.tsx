"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { useToast } from "@/components/admin/toast";
import type { ActionResult } from "@/types/actions";

export function ConfirmButton({
  action,
  confirmMessage,
  children,
  className,
}: {
  action: () => Promise<ActionResult>;
  confirmMessage: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { show } = useToast();

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      className={`disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await action();
          show(result.message, result.ok ? "success" : "error");
          if (result.ok && result.redirectTo) router.push(result.redirectTo);
          router.refresh();
        });
      }}
    >
      {pending ? "Working…" : children}
    </button>
  );
}
