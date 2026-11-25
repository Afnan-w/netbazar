import { z } from "zod";

function emptyToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

function normalizeWhatsappNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("880") ? digits : `88${digits.replace(/^0/, "")}`;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  id: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  name: z.string().trim().min(2, "Name is required.").max(150),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(150)
    .regex(slugPattern, "Use lowercase letters, numbers and hyphens only."),
  sku: z.string().trim().min(1, "SKU is required.").max(80),
  category_id: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  price_bdt: z.coerce
    .number()
    .positive("Price must be greater than zero.")
    .max(100000000, "Price is too large."),
  reference_price_bdt: z.preprocess(
    emptyToUndefined,
    z.coerce.number().positive("Reference price must be greater than zero.").optional(),
  ),
  status: z.enum(["available", "unavailable", "draft"]),
  is_featured: z.boolean(),
  is_popular: z.boolean(),
  description: z.string().max(5000),
});

export const categorySchema = z.object({
  id: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  name: z.string().trim().min(2, "Name is required.").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(100)
    .regex(slugPattern, "Use lowercase letters, numbers and hyphens only."),
  sort_order: z.coerce.number().int().min(0).max(9999),
});

export const settingsSchema = z.object({
  whatsapp_number: z
    .string()
    .trim()
    .regex(
      /^\+?(?:880\d{10}|0\d{9,10}|\d{9,10})$/,
      "Enter a valid Bangladesh number, e.g. +8801627293330.",
    )
    .transform(normalizeWhatsappNumber),
  announcement_text: z.string().max(300),
  contact_email: z.union([z.literal(""), z.string().trim().email("Enter a valid email.")]),
  facebook_url: z.union([
    z.literal(""),
    z.string().trim().url("Enter a valid URL."),
  ]),
  instagram_url: z.union([
    z.literal(""),
    z.string().trim().url("Enter a valid URL."),
  ]),
});

export const requestUpdateSchema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "quoted",
    "paid",
    "shipped",
    "closed",
    "cancelled",
  ]),
  admin_notes: z.string().max(5000),
});

export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
