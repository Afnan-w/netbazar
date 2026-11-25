"use client";

import Image from "next/image";
import { useState } from "react";
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
      <div className="relative aspect-square overflow-hidden rounded-[28px] border border-ink/10 bg-canvas shadow-[0_24px_70px_-44px_rgba(24,35,45,0.5)]">
        {active?.url ? (
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt || `${productName} product photo`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4"
          />
        ) : (
          <ProductVisual
            categorySlug={categorySlug}
            name={productName}
            iconClassName="h-24 w-24"
          />
        )}
      </div>

      {!active?.url && (
        <p className="px-1 text-xs text-ink/45">
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
              className={`relative h-20 w-20 overflow-hidden rounded-2xl border bg-canvas transition-colors ${
                index === activeIndex
                  ? "border-brand"
                  : "border-ink/10 hover:border-brand/50"
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
