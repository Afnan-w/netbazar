"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formString, friendlyDatabaseError } from "@/lib/utils/form";
import { categorySchema } from "@/lib/validators/admin";
import type { ActionResult } from "@/types/actions";

const uuid = z.string().uuid();

export async function saveCategory(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    id: formString(formData, "id"),
    name: formString(formData, "name"),
    slug: formString(formData, "slug"),
    sort_order: formString(formData, "sort_order"),
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

  const { id, ...values } = parsed.data;
  if (id) {
    const { error } = await supabase
      .from("categories")
      .update(values)
      .eq("id", id);
    if (error) return { ok: false, message: friendlyDatabaseError(error.message) };
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { ok: true, message: "Category saved." };
  }

  const { error } = await supabase.from("categories").insert(values);
  if (error) return { ok: false, message: friendlyDatabaseError(error.message) };
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { ok: true, message: "Category created." };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(id).success) {
    return { ok: false, message: "Invalid category id." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, message: "The service role key is missing." };
  }

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if (count && count > 0) {
    return {
      ok: false,
      message: `Move or delete the ${count} product${count === 1 ? "" : "s"} in this category first.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { ok: true, message: "Category deleted." };
}
