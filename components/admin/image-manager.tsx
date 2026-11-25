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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <section className="nova-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-peach text-primary">
            <ImagePlus aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">Product images</h2>
            <p className="mt-0.5 text-xs text-muted">
              JPG, PNG or WebP up to 5 MB each. The first image is used as the
              cover photo.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary">
          {ordered.length} image{ordered.length === 1 ? "" : "s"}
        </span>
      </div>

      <form
        onSubmit={handleUpload}
        className="mt-5 flex flex-wrap items-center gap-3 rounded-panel border border-dashed border-primary/35 bg-primary-tint/40 p-4 sm:p-5"
      >
        <input
          type="file"
          name="files"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          aria-label="Choose product images"
          className="max-w-full text-sm text-secondary-ink file:mr-3 file:min-h-11 file:rounded-control file:border file:border-border file:bg-surface file:px-4 file:text-sm file:font-semibold file:text-secondary-ink hover:file:border-primary hover:file:text-primary"
        />
        <Button type="submit" disabled={pending} pill>
          <ImagePlus aria-hidden="true" className="h-4 w-4" />
          Upload
        </Button>
      </form>

      {ordered.length === 0 ? (
        <div className="mt-5 rounded-card border border-dashed border-border bg-page/50 px-4 py-8 text-center text-sm text-muted">
          No images yet. Upload the first photo above.
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {ordered.map((image, index) => {
            const url = getProductImageUrl(image.storage_path);
            return (
              <li
                key={image.id}
                className="flex flex-col gap-4 rounded-card border border-border bg-page/40 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-control border border-border bg-image-backdrop">
                  {url ? (
                    <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-muted">
                      No preview
                    </span>
                  )}
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      Cover
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`alt-${image.id}`}
                    className="mb-2 block text-xs font-semibold text-secondary-ink"
                  >
                    Alt text
                  </label>
                  <div className="flex gap-2">
                    <Input
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
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="shrink-0"
                      disabled={pending}
                      onClick={() => saveAlt(image)}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} up`}
                    disabled={pending || index === 0}
                    onClick={() => move(index, -1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border text-secondary-ink transition-colors hover:bg-primary-tint hover:text-primary disabled:opacity-35"
                  >
                    <ArrowUp aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} down`}
                    disabled={pending || index === ordered.length - 1}
                    onClick={() => move(index, 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border text-secondary-ink transition-colors hover:bg-primary-tint hover:text-primary disabled:opacity-35"
                  >
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete image ${index + 1}`}
                    disabled={pending}
                    onClick={() => remove(image, index)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border text-secondary-ink transition-colors hover:bg-blush hover:text-sale disabled:opacity-35"
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
