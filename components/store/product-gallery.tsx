"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type GalleryImage = {
  url: string;
  alt: string;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-ink/10 bg-canvas">
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
          <div className="flex h-full flex-col items-center justify-center gap-3 text-ink/35">
            <Package aria-hidden="true" className="h-14 w-14" />
            <p className="text-sm">Product photos will be added soon.</p>
          </div>
        )}
      </div>

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
                <Package aria-hidden="true" className="m-auto h-6 w-6 text-ink/30" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
