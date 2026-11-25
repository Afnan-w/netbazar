import type { Json } from "@/types/database";

export function specificationRows(value: Json): [string, string][] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value)
    .filter(([, entry]) =>
      ["string", "number", "boolean"].includes(typeof entry),
    )
    .map(([key, entry]) => [key, String(entry)]);
}

export function isNewProduct(createdAt: string): boolean {
  const age = Date.now() - new Date(createdAt).getTime();
  return age >= 0 && age < 14 * 24 * 60 * 60 * 1000;
}
