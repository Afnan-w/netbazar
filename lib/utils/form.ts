import type { Json } from "@/types/database";

export function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function formSpecifications(formData: FormData): Json {
  const keys = formData
    .getAll("spec_key")
    .map((value) => (typeof value === "string" ? value.trim() : ""));
  const values = formData
    .getAll("spec_value")
    .map((value) => (typeof value === "string" ? value.trim() : ""));

  const specifications: Record<string, string> = {};
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const value = values[index] ?? "";
    if (key && value && Object.keys(specifications).length < 30) {
      specifications[key] = value.slice(0, 300);
    }
  }
  return specifications;
}

export function friendlyDatabaseError(message: string): string {
  if (/duplicate key|unique constraint/i.test(message)) {
    return "That SKU or slug is already in use. Choose a different one.";
  }
  return message;
}
