"use client";

import Image from "next/image";
import { useState } from "react";
import {
  resetPointerMedia,
  updatePointerMedia,
} from "@/components/store/product-media";
import { ProductVisual } from "@/components/store/product-visual";

export type GalleryImage = {
  url: string;
  alt: string;
};

export function ProductGallery({
  images,
  productName,
  categorySlug,
}: {
  images: GalleryImage[];
  productName: string;
  categorySlug: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="space-y-3">
      <div
        className="product-media group relative aspect-square cursor-crosshair overflow-hidden rounded-panel border border-border bg-image-backdrop shadow-card"
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          updatePointerMedia(
            event.currentTarget,
            event.clientX,
            event.clientY,
          );
        }}
        onPointerLeave={(event) => resetPointerMedia(event.currentTarget)}
        onBlur={(event) => resetPointerMedia(event.currentTarget)}
      >
        <div className="product-media-layer">
          {active?.url ? (
            <Image
              key={active.url}
              src={active.url}
              alt={active.alt || `${productName} product photo`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="gallery-image object-contain p-5"
            />
          ) : (
            <ProductVisual
              categorySlug={categorySlug}
              name={productName}
              iconClassName="h-24 w-24"
            />
          )}
        </div>
        <span aria-hidden="true" className="product-media-glow" />
      </div>

      {!active?.url && (
        <p className="px-1 text-xs text-muted">
          Preview visual. Add real product photos in the admin dashboard.
        </p>
      )}

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3" role="group" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${productName}`}
              aria-pressed={index === activeIndex}
              className={`relative h-20 w-20 overflow-hidden rounded-control border bg-image-backdrop transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card pressable ${
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <ProductVisual
                  categorySlug={categorySlug}
                  name={`${productName} ${index + 1}`}
                  iconClassName="h-7 w-7"
                />
              )}
              {index === activeIndex && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
