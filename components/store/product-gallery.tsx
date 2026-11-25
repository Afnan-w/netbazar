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
  const [origin, setOrigin] = useState("50% 50%");
  const active = images[activeIndex];

  return (
    <div className="space-y-3">
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border border-line bg-canvas premium-card"
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width) * 100;
          const y = ((event.clientY - bounds.top) / bounds.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }}
        onMouseLeave={() => setOrigin("50% 50%")}
      >
        {active?.url ? (
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt || `${productName} product photo`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            style={{ transformOrigin: origin }}
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-150"
          />
        ) : (
          <ProductVisual
            categorySlug={categorySlug}
            name={productName}
            iconClassName="h-24 w-24"
          />
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-surface/85 px-2.5 py-1 text-[10px] font-medium text-muted backdrop-blur">
          Hover to zoom
        </span>
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
              className={`relative h-20 w-20 overflow-hidden rounded-lg border bg-canvas transition-all hover:-translate-y-0.5 hover:scale-105 ${
                index === activeIndex
                  ? "border-action ring-2 ring-action/20"
                  : "border-line hover:border-action/50"
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
