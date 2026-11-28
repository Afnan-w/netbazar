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
    <p id={id} className="mt-1.5 text-xs text-sale">
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
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-5 text-sm font-medium text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60 pressable"
    >
      {pending ? "Sending…" : "Submit sourcing request"}
      {!pending && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "text-sm font-medium text-ink";

export function RequestForm({
  defaultDescription = "",
  defaultLink = "",
}: {
  defaultDescription?: string;
  defaultLink?: string;
}) {
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
      <div className="rounded-card border border-primary/15 bg-primary-tint p-6 shadow-card sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-control bg-surface text-primary shadow-card">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Request received — we&apos;ll check the supplier
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary-ink">{state.message}</p>
        {state.success && (
          <>
            <p className="mt-4 text-sm text-secondary-ink">
              {state.success.description} · Quantity {state.success.quantity}
            </p>
            <a
              href={state.success.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-5 text-sm font-medium text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 active:bg-primary-active pressable"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Continue with photos on WhatsApp
            </a>
          </>
        )}
        <div className="mt-6">
          <Link
            href="/request"
            className="inline-flex min-h-11 items-center text-sm text-secondary-ink underline underline-offset-4 transition-colors duration-200 hover:text-primary"
          >
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
      className="rounded-card border border-border bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            What do you want from China? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={defaultDescription}
            placeholder="Product name, description, model or colour"
            required
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
            className={inputClass}
          />
          <FieldError id="description-error" error={errors.description} />
          <p className="mt-1.5 text-xs text-muted">
            A photo is even better — you can attach it when we continue on WhatsApp.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product_link" className={labelClass}>
            Product link <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="product_link"
            name="product_link"
            type="url"
            defaultValue={defaultLink}
            placeholder="https://alibaba.com / aliexpress.com / 1688.com / taobao.com"
            aria-invalid={Boolean(errors.product_link)}
            aria-describedby={errors.product_link ? "product_link-error" : undefined}
            className={inputClass}
          />
          <FieldError id="product_link-error" error={errors.product_link} />
          <p className="mt-1.5 text-xs text-muted">
            Saw it on another site? Paste the link here and we&apos;ll check it.
          </p>
        </div>

        <div>
          <label htmlFor="quantity" className={labelClass}>
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
          <label htmlFor="budget_bdt" className={labelClass}>
            Budget in BDT <span className="font-normal text-muted">(optional)</span>
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
          <label htmlFor="name" className={labelClass}>
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
          <label htmlFor="phone" className={labelClass}>
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
          <label htmlFor="address" className={labelClass}>
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
        <p role="alert" className="mt-6 rounded-control bg-sale/10 px-4 py-3 text-sm text-sale ring-1 ring-sale/20">
          {state.message}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p className="text-xs text-muted">No payment until you accept our quote.</p>
      </div>
    </form>
  );
}
