"use client";

import { useActionState, useEffect } from "react";
import { updateRequest } from "@/app/admin/(dashboard)/requests/actions";
import { useToast } from "@/components/admin/toast";
import { idleActionResult } from "@/types/actions";
import type { ProductRequest, ProductRequestStatus } from "@/types/database";

const statuses: ProductRequestStatus[] = [
  "new",
  "contacted",
  "quoted",
  "paid",
  "shipped",
  "closed",
  "cancelled",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand";

export function RequestUpdateForm({ request }: { request: ProductRequest }) {
  const [state, formAction] = useActionState(updateRequest, idleActionResult);
  const { show } = useToast();

  useEffect(() => {
    if (!state.message) return;
    show(state.message, state.ok ? "success" : "error");
  }, [state, show]);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6"
    >
      <h2 className="text-lg font-medium">Update request</h2>
      <input type="hidden" name="id" value={request.id} />
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={request.status}
            className={inputClass}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="admin_notes" className="text-sm font-medium">
            Internal notes
          </label>
          <textarea
            id="admin_notes"
            name="admin_notes"
            rows={5}
            maxLength={5000}
            defaultValue={request.admin_notes}
            placeholder="Supplier quotes, quotes given, payment status, delivery notes…"
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-ink/50">
            Only admins can see these notes.
          </p>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 rounded-full border border-brand bg-brand px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Save changes
      </button>
    </form>
  );
}
