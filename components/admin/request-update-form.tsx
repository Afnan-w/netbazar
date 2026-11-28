"use client";

import { ClipboardList } from "lucide-react";
import { useActionState, useEffect } from "react";
import { updateRequest } from "@/app/admin/(dashboard)/requests/actions";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/input";
import { idleActionResult } from "@/types/actions";
import type { ProductRequest, ProductRequestStatus } from "@/types/database";

const statuses: { value: ProductRequestStatus; label: string }[] = [
  { value: "new", label: "New request" },
  { value: "contacted", label: "Checking supplier" },
  { value: "quoted", label: "Quote sent" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "In transit" },
  { value: "closed", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function RequestUpdateForm({ request }: { request: ProductRequest }) {
  const [state, formAction] = useActionState(updateRequest, idleActionResult);
  const { show } = useToast();

  useEffect(() => {
    if (!state.message) return;
    show(state.message, state.ok ? "success" : "error");
  }, [state, show]);

  return (
    <form action={formAction} className="nova-panel p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-control bg-primary-tint text-primary">
          <ClipboardList aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-ink">Update sourcing request</h2>
          <p className="mt-0.5 text-xs text-muted">
            Track the supplier check, quote and delivery.
          </p>
        </div>
      </div>
      <input type="hidden" name="id" value={request.id} />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Status" htmlFor="status">
          <Select
            id="status"
            name="status"
            defaultValue={request.status}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Internal notes"
            htmlFor="admin_notes"
            hint="Only admins can see these notes."
          >
            <Textarea
              id="admin_notes"
              name="admin_notes"
              rows={5}
              maxLength={5000}
              defaultValue={request.admin_notes}
              placeholder="Supplier quote, unit price, shipping, quote sent, payment and delivery notes…"
            />
          </Field>
        </div>
      </div>
      <Button type="submit" size="lg" pill className="mt-6 min-w-44">
        Save changes
      </Button>
    </form>
  );
}
