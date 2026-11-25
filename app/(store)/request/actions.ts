"use server";

import { headers } from "next/headers";
import { getSiteSettings } from "@/lib/data/store";
import { createClient } from "@/lib/supabase/server";
import { formatBDT } from "@/lib/utils/format";
import { buildWhatsAppUrl, requestWhatsAppMessage } from "@/lib/utils/whatsapp";
import {
  fieldErrorsFrom,
  productRequestSchema,
  type ProductRequestInput,
} from "@/lib/validators/product-request";

export type RequestFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
  success: {
    whatsappUrl: string;
    description: string;
    quantity: number;
  } | null;
};

export const initialRequestState: RequestFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  success: null,
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function stringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function rawInput(formData: FormData) {
  return {
    description: stringValue(formData, "description"),
    product_link: stringValue(formData, "product_link"),
    quantity: stringValue(formData, "quantity"),
    budget_bdt: stringValue(formData, "budget_bdt"),
    name: stringValue(formData, "name"),
    phone: stringValue(formData, "phone"),
    address: stringValue(formData, "address"),
  };
}

async function clientKey(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for") ?? "unknown";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

function withinRateLimit(key: string): boolean {
  const now = Date.now();
  if (rateLimits.size > 1000) {
    for (const [storedKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(storedKey);
    }
  }

  const entry = rateLimits.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;

  entry.count += 1;
  return true;
}

export async function submitProductRequest(
  _previousState: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  // Honeypot: give bots a quiet success instead of a validation error.
  if (stringValue(formData, "website").trim() !== "") {
    return {
      status: "success",
      message: "Thanks. We will be in touch on WhatsApp.",
      fieldErrors: {},
      success: null,
    };
  }

  const parsed = productRequestSchema.safeParse(rawInput(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
      success: null,
    };
  }

  if (!withinRateLimit(await clientKey())) {
    return {
      status: "error",
      message:
        "You have sent several requests recently. Please wait a few minutes or contact us on WhatsApp.",
      fieldErrors: {},
      success: null,
    };
  }

  const input: ProductRequestInput = parsed.data;
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return {
      status: "error",
      message: "The request service is not configured. Please contact us on WhatsApp.",
      fieldErrors: {},
      success: null,
    };
  }

  const { error } = await supabase.from("product_requests").insert({
    description: input.description,
    product_link: input.product_link ?? null,
    quantity: input.quantity,
    budget_bdt: input.budget_bdt ?? null,
    name: input.name,
    phone: input.phone,
    address: input.address,
  });

  if (error) {
    console.error("Could not save product request:", error.message);
    return {
      status: "error",
      message: "We could not save your request. Please try again or message us on WhatsApp.",
      fieldErrors: {},
      success: null,
    };
  }

  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    requestWhatsAppMessage({
      description: input.description,
      productLink: input.product_link ?? "",
      quantity: input.quantity,
      budget: input.budget_bdt ? formatBDT(input.budget_bdt) : "",
      name: input.name,
      phone: input.phone,
      address: input.address,
    }),
  );

  return {
    status: "success",
    message: "Request saved. Continue on WhatsApp so we can confirm the details.",
    fieldErrors: {},
    success: {
      whatsappUrl,
      description: input.description,
      quantity: input.quantity,
    },
  };
}
