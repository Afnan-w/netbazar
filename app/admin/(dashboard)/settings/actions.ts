"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formString } from "@/lib/utils/form";
import { settingsSchema } from "@/lib/validators/admin";
import type { ActionResult } from "@/types/actions";

export async function saveSettings(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    whatsapp_number: formString(formData, "whatsapp_number"),
    announcement_text: formString(formData, "announcement_text"),
    contact_email: formString(formData, "contact_email"),
    facebook_url: formString(formData, "facebook_url"),
    instagram_url: formString(formData, "instagram_url"),
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
    .from("site_settings")
    .update(parsed.data)
    .eq("id", 1);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/faq");
  return { ok: true, message: "Settings saved." };
}
