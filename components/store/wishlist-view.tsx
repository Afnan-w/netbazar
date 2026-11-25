"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ProductCard } from "@/components/store/product-card";
import type { ProductListItem } from "@/lib/data/store";
import {
  getWishlistServerSnapshot,
  getWishlistSnapshot,
  subscribeWishlist,
} from "@/lib/utils/wishlist";

export function WishlistView({
  products,
  whatsappNumber,
}: {
  products: ProductListItem[];
  whatsappNumber: string;
}) {
  const ids = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot,
  );
  const saved = products.filter((product) => ids.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Saved picks
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your wishlist
        </h1>
      </header>

      {saved.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-canvas/60 px-6 py-20 text-center">
          <Heart aria-hidden="true" className="mx-auto h-8 w-8 text-accent" />
          <h2 className="mt-4 text-lg font-medium">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Tap the heart on any product to keep it here while you browse.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-highlight"
          >
            Browse products
          </Link>
        </div>
      )}
    </div>
  );
}
