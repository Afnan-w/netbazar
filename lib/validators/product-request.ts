import { z } from "zod";

function emptyToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export const productRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(5, "Tell us a little more about what you need.")
    .max(1000, "Please keep the description under 1000 characters."),
  product_link: z.preprocess(
    emptyToUndefined,
    z.string().url("Enter a valid link, starting with https://").optional(),
  ),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(999, "Quantity must be 999 or less."),
  budget_bdt: z.preprocess(
    (value) => {
      if (emptyToUndefined(value) === undefined) return undefined;
      return typeof value === "string" ? Number(value) : value;
    },
    z
      .number()
      .positive("Budget must be greater than zero.")
      .max(100000000, "Budget is too large.")
      .optional(),
  ),
  name: z.string().trim().min(2, "Enter your name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,20}$/, "Enter a valid phone number."),
  address: z
    .string()
    .trim()
    .min(5, "Enter your delivery address in Bangladesh.")
    .max(300),
});

export type ProductRequestInput = z.infer<typeof productRequestSchema>;

export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
