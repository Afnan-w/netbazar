"use client";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import {
  initialRequestState,
  submitProductRequest,
} from "@/app/(store)/request/actions";
import {
  fieldErrorsFrom,
  productRequestSchema,
} from "@/lib/validators/product-request";

type Errors = Record<string, string>;

function readFormValues(form: HTMLFormElement) {
  const data = new FormData(form);
  const value = (key: string) => String(data.get(key) ?? "");
  return {
    description: value("description"),
    product_link: value("product_link"),
    quantity: value("quantity"),
    budget_bdt: value("budget_bdt"),
    name: value("name"),
    phone: value("phone"),
    address: value("address"),
  };
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600">
      {error}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full border border-action bg-action px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-action-strong disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send request"}
      {!pending && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/20";

export function RequestForm() {
  const [state, formAction] = useActionState(
    submitProductRequest,
    initialRequestState,
  );
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const errors = { ...state.fieldErrors, ...clientErrors };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = productRequestSchema.safeParse(readFormValues(event.currentTarget));
    if (!result.success) {
      event.preventDefault();
      setClientErrors(fieldErrorsFrom(result.error));
      return;
    }
    setClientErrors({});
  }

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-brand/25 bg-mint/50 p-6 sm:p-8">
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-brand" />
        <h2 className="mt-5 text-2xl font-light tracking-tight">Request received</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{state.message}</p>
        {state.success && (
          <>
            <p className="mt-4 text-sm text-ink/65">
              {state.success.description} · Quantity {state.success.quantity}
            </p>
            <a
              href={state.success.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-action bg-action px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-action-strong"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Continue on WhatsApp
            </a>
          </>
        )}
        <div className="mt-6">
          <Link href="/request" className="text-sm text-ink/60 underline hover:text-brand">
            Submit another request
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-ink/10 bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            What are you looking for? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Product name, description or model"
            required
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
            className={inputClass}
          />
          <FieldError id="description-error" error={errors.description} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product_link" className="text-sm font-medium">
            Product link <span className="font-normal text-ink/45">(optional)</span>
          </label>
          <input
            id="product_link"
            name="product_link"
            type="url"
            placeholder="https://"
            aria-invalid={Boolean(errors.product_link)}
            aria-describedby={errors.product_link ? "product_link-error" : undefined}
            className={inputClass}
          />
          <FieldError id="product_link-error" error={errors.product_link} />
        </div>

        <div>
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity <span aria-hidden="true">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={999}
            defaultValue={1}
            required
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? "quantity-error" : undefined}
            className={inputClass}
          />
          <FieldError id="quantity-error" error={errors.quantity} />
        </div>

        <div>
          <label htmlFor="budget_bdt" className="text-sm font-medium">
            Budget in BDT <span className="font-normal text-ink/45">(optional)</span>
          </label>
          <input
            id="budget_bdt"
            name="budget_bdt"
            type="number"
            min={1}
            step="1"
            placeholder="e.g. 1500"
            aria-invalid={Boolean(errors.budget_bdt)}
            aria-describedby={errors.budget_bdt ? "budget_error" : undefined}
            className={inputClass}
          />
          <FieldError id="budget_error" error={errors.budget_bdt} />
        </div>

        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
          />
          <FieldError id="name-error" error={errors.name} />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Phone / WhatsApp number <span aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputClass}
          />
          <FieldError id="phone-error" error={errors.phone} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="text-sm font-medium">
            Delivery address in Bangladesh <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            autoComplete="street-address"
            required
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? "address-error" : undefined}
            className={inputClass}
          />
          <FieldError id="address-error" error={errors.address} />
        </div>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p className="text-xs text-ink/50">We usually reply on WhatsApp.</p>
      </div>
    </form>
  );
}
