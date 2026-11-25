"use client";

import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import {
  deleteProductImage,
  reorderProductImages,
  updateProductImageAlt,
  uploadProductImages,
} from "@/app/admin/(dashboard)/products/actions";
import { useToast } from "@/components/admin/toast";
import { getProductImageUrl } from "@/lib/utils/images";
import type { ActionResult } from "@/types/actions";
import type { ProductImage } from "@/types/database";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const [order, setOrder] = useState<string[]>(() => images.map((image) => image.id));
  const [altOverrides, setAltOverrides] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { show } = useToast();

  // The saved order is only an override: new images append, deleted ones vanish.
  const byId = new Map(images.map((image) => [image.id, image]));
  const ordered = order
    .map((id) => byId.get(id))
    .filter((image): image is ProductImage => Boolean(image));
  for (const image of images) {
    if (!order.includes(image.id)) ordered.push(image);
  }

  function run(task: Promise<ActionResult>) {
    startTransition(async () => {
      const result = await task;
      show(result.message, result.ok ? "success" : "error");
      if (result.ok) router.refresh();
    });
  }

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(uploadProductImages(productId, formData));
    event.currentTarget.reset();
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    const current = next[index];
    const swap = next[target];
    if (!current || !swap) return;
    next[index] = swap;
    next[target] = current;
    setOrder(next.map((image) => image.id));
    run(reorderProductImages(productId, next.map((image) => image.id)));
  }

  function saveAlt(image: ProductImage) {
    const value = altOverrides[image.id] ?? image.alt;
    startTransition(async () => {
      const result = await updateProductImageAlt(productId, image.id, value);
      show(result.message, result.ok ? "success" : "error");
      if (result.ok) {
        setAltOverrides((current) => {
          const next = { ...current };
          delete next[image.id];
          return next;
        });
        router.refresh();
      }
    });
  }

  function remove(image: ProductImage, index: number) {
    if (!window.confirm(`Delete image ${index + 1}? This cannot be undone.`)) return;
    run(deleteProductImage(productId, image.id));
  }

  return (
    <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">Product images</h2>
          <p className="mt-1 text-sm text-ink/55">
            JPG, PNG or WebP up to 5 MB each. The first image is used as the cover
            photo.
          </p>
        </div>
        <span className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/55">
          {ordered.length} image{ordered.length === 1 ? "" : "s"}
        </span>
      </div>

      <form
        onSubmit={handleUpload}
        className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-ink/20 bg-canvas p-4"
      >
        <input
          type="file"
          name="files"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          aria-label="Choose product images"
          className="max-w-full text-sm file:mr-3 file:rounded-full file:border file:border-ink/20 file:bg-surface file:px-4 file:py-2 file:text-sm file:font-medium hover:file:border-brand"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <ImagePlus aria-hidden="true" className="h-4 w-4" />
          Upload
        </button>
      </form>

      {ordered.length === 0 ? (
        <p className="mt-5 text-sm text-ink/50">
          No images yet. Upload the first photo above.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {ordered.map((image, index) => {
            const url = getProductImageUrl(image.storage_path);
            return (
              <li
                key={image.id}
                className="flex flex-col gap-4 rounded-2xl border border-ink/10 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-canvas">
                  {url ? (
                    <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-ink/40">
                      No preview
                    </span>
                  )}
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-medium text-white">
                      Cover
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`alt-${image.id}`}
                    className="text-xs font-medium text-ink/60"
                  >
                    Alt text
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      id={`alt-${image.id}`}
                      value={altOverrides[image.id] ?? image.alt}
                      onChange={(event) =>
                        setAltOverrides((current) => ({
                          ...current,
                          [image.id]: event.target.value,
                        }))
                      }
                      maxLength={200}
                      placeholder="Describe this photo for accessibility"
                      className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => saveAlt(image)}
                      className="shrink-0 rounded-xl border border-ink/20 px-3 py-2 text-sm hover:border-brand hover:text-brand disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} up`}
                    disabled={pending || index === 0}
                    onClick={() => move(index, -1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 hover:border-brand hover:text-brand disabled:opacity-35"
                  >
                    <ArrowUp aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} down`}
                    disabled={pending || index === ordered.length - 1}
                    onClick={() => move(index, 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 hover:border-brand hover:text-brand disabled:opacity-35"
                  >
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete image ${index + 1}`}
                    disabled={pending}
                    onClick={() => remove(image, index)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/15 text-ink/55 hover:border-red-300 hover:text-red-600 disabled:opacity-35"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
