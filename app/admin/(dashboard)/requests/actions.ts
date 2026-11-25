"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formString } from "@/lib/utils/form";
import { requestUpdateSchema } from "@/lib/validators/admin";
import type { ActionResult } from "@/types/actions";

const uuid = z.string().uuid();

export async function updateRequest(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = formString(formData, "id");
  if (!uuid.safeParse(id).success) {
    return { ok: false, message: "Invalid request id." };
  }

  const parsed = requestUpdateSchema.safeParse({
    status: formString(formData, "status"),
    admin_notes: formString(formData, "admin_notes"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, message: "The service role key is missing." };
  }

  const { error } = await supabase
    .from("product_requests")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
  return { ok: true, message: "Request updated." };
}
