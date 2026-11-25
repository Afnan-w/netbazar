"use client";

import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";
import { ProductVisual } from "@/components/store/product-visual";

export function updatePointerMedia(
  element: HTMLElement,
  clientX: number,
  clientY: number,
) {
  const bounds = element.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const x = Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width));
  const y = Math.min(1, Math.max(0, (clientY - bounds.top) / bounds.height));

  element.style.setProperty("--pointer-x", `${x * 100}%`);
  element.style.setProperty("--pointer-y", `${y * 100}%`);
  element.style.setProperty("--media-x", `${(x - 0.5) * 12}px`);
  element.style.setProperty("--media-y", `${(y - 0.5) * 12}px`);
}

export function resetPointerMedia(element: HTMLElement) {
  element.style.setProperty("--pointer-x", "50%");
  element.style.setProperty("--pointer-y", "50%");
  element.style.setProperty("--media-x", "0px");
  element.style.setProperty("--media-y", "0px");
}

export function ProductMediaLink({
  href,
  name,
  imageUrl,
  alt,
  sizes,
  categorySlug,
  iconClassName,
}: {
  href: string;
  name: string;
  imageUrl: string;
  alt: string;
  sizes: string;
  categorySlug: string;
  iconClassName?: string;
}) {
  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") return;
    updatePointerMedia(event.currentTarget, event.clientX, event.clientY);
  }

  function handlePointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    resetPointerMedia(event.currentTarget);
  }

  return (
    <Link
      href={href}
      aria-label={`View ${name}`}
      className="product-media absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onBlur={(event) => resetPointerMedia(event.currentTarget)}
    >
      <span className="product-media-layer">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <ProductVisual
            categorySlug={categorySlug}
            name={name}
            iconClassName={iconClassName}
          />
        )}
      </span>
      <span aria-hidden="true" className="product-media-glow" />
    </Link>
  );
}
