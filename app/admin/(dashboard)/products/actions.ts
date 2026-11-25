"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formSpecifications, formString, friendlyDatabaseError } from "@/lib/utils/form";
import { slugify } from "@/lib/utils/slug";
import { productSchema } from "@/lib/validators/admin";
import type { ActionResult } from "@/types/actions";

const uuid = z.string().uuid();
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageBytes = 5 * 1024 * 1024;
const bucket = "product-images";

function invalidId(): ActionResult {
  return { ok: false, message: "Invalid product id." };
}

function configError(): ActionResult {
  return {
    ok: false,
    message: "The service role key is missing. Check your server environment variables.",
  };
}

function firstValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form.";
}

export async function saveProduct(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const name = formString(formData, "name");
  const raw = {
    id: formString(formData, "id"),
    name,
    slug: formString(formData, "slug") || slugify(name),
    sku: formString(formData, "sku"),
    category_id: formString(formData, "category_id"),
    price_bdt: formString(formData, "price_bdt"),
    reference_price_bdt: formString(formData, "reference_price_bdt"),
    status: formString(formData, "status"),
    is_featured: formData.get("is_featured") === "on",
    is_popular: formData.get("is_popular") === "on",
    description: formString(formData, "description"),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: firstValidationMessage(parsed.error) };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  const { id, ...values } = parsed.data;
  const payload = {
    ...values,
    category_id: values.category_id ?? null,
    reference_price_bdt: values.reference_price_bdt ?? null,
    specifications: formSpecifications(formData),
  };

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { ok: false, message: friendlyDatabaseError(error.message) };
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/products");
    return { ok: true, message: "Product saved." };
  }

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();
  if (error || !data) {
    return {
      ok: false,
      message: friendlyDatabaseError(error?.message ?? "Could not create the product."),
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return {
    ok: true,
    message: "Product created. Add photos on the next screen.",
    redirectTo: `/admin/products/${data.id}/edit`,
  };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(id).success) return invalidId();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", id);
  if (images?.length) {
    await supabase.storage
      .from(bucket)
      .remove(images.map((image) => image.storage_path));
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { ok: true, message: "Product deleted." };
}

export async function duplicateProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(id).success) return invalidId();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  const { data: original, error: originalError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (originalError || !original) {
    return { ok: false, message: "Product not found." };
  }

  let sku = `${original.sku}-COPY`;
  let slug = `${original.slug}-copy`;
  for (let attempt = 2; attempt <= 25; attempt += 1) {
    const [{ data: skuMatch }, { data: slugMatch }] = await Promise.all([
      supabase.from("products").select("id").eq("sku", sku).maybeSingle(),
      supabase.from("products").select("id").eq("slug", slug).maybeSingle(),
    ]);
    if (!skuMatch && !slugMatch) break;
    sku = `${original.sku}-COPY-${attempt}`;
    slug = `${original.slug}-copy-${attempt}`;
  }

  const { data: copy, error: insertError } = await supabase
    .from("products")
    .insert({
      sku,
      slug,
      name: original.name,
      description: original.description,
      specifications: original.specifications,
      price_bdt: original.price_bdt,
      reference_price_bdt: original.reference_price_bdt,
      category_id: original.category_id,
      status: "draft",
      is_featured: false,
      is_popular: false,
    })
    .select("id")
    .single();

  if (insertError || !copy) {
    return {
      ok: false,
      message: friendlyDatabaseError(insertError?.message ?? "Could not duplicate product."),
    };
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  for (const image of images ?? []) {
    const extension = image.storage_path.split(".").pop() ?? "jpg";
    const destination = `${copy.id}/${crypto.randomUUID()}.${extension}`;
    const { error: copyError } = await supabase.storage
      .from(bucket)
      .copy(image.storage_path, destination);
    if (copyError) continue;

    await supabase.from("product_images").insert({
      product_id: copy.id,
      storage_path: destination,
      sort_order: image.sort_order,
      alt: image.alt,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return {
    ok: true,
    message: "Product duplicated as a draft.",
    redirectTo: `/admin/products/${copy.id}/edit`,
  };
}

export async function uploadProductImages(
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(productId).success) return invalidId();

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length === 0) return { ok: false, message: "Choose at least one image." };

  for (const file of files) {
    if (!allowedMimeTypes.includes(file.type)) {
      return { ok: false, message: `${file.name} must be a jpg, png or webp image.` };
    }
    if (file.size > maxImageBytes) {
      return { ok: false, message: `${file.name} is larger than 5 MB.` };
    }
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  for (const [index, file] of files.entries()) {
    const extension =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : "webp";
    const path = `${productId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { ok: false, message: uploadError.message };
    }

    const { error: insertError } = await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: path,
      sort_order: (count ?? 0) + index,
      alt: "",
    });

    if (insertError) {
      await supabase.storage.from(bucket).remove([path]);
      return { ok: false, message: insertError.message };
    }
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/products");
  return { ok: true, message: `${files.length} image${files.length === 1 ? "" : "s"} uploaded.` };
}

export async function reorderProductImages(
  productId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(productId).success) return invalidId();
  if (!orderedIds.every((id) => uuid.safeParse(id).success)) {
    return { ok: false, message: "Invalid image order." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from("product_images")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("product_id", productId);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/products");
  return { ok: true, message: "Image order saved." };
}

export async function updateProductImageAlt(
  productId: string,
  imageId: string,
  alt: string,
): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(productId).success || !uuid.safeParse(imageId).success) {
    return { ok: false, message: "Invalid image id." };
  }
  if (alt.length > 200) return { ok: false, message: "Alt text must be under 200 characters." };

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  const { error } = await supabase
    .from("product_images")
    .update({ alt })
    .eq("id", imageId)
    .eq("product_id", productId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
  return { ok: true, message: "Alt text saved." };
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<ActionResult> {
  await requireAdmin();
  if (!uuid.safeParse(productId).success || !uuid.safeParse(imageId).success) {
    return { ok: false, message: "Invalid image id." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return configError();
  }

  const { data: image } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();

  if (!image) return { ok: false, message: "Image not found." };

  const { error: storageError } = await supabase.storage
    .from(bucket)
    .remove([image.storage_path]);
  if (storageError) return { ok: false, message: storageError.message };

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/products");
  return { ok: true, message: "Image deleted." };
}
