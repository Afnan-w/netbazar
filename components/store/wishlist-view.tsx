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

export function WishlistView({ products }: { products: ProductListItem[] }) {
  const ids = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot,
  );
  const saved = products.filter((product) => ids.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="inline-flex rounded-badge bg-primary-tint px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Saved examples
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Items you saved
        </h1>
      </header>

      {saved.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-panel border border-dashed border-border bg-surface px-6 py-20 text-center shadow-card">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-control bg-primary-tint text-primary">
            <Heart aria-hidden="true" className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-secondary-ink">
            Anything you need can be requested directly — a saved item is not
            required.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-primary bg-primary px-5 text-sm font-medium text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-card-hover active:translate-y-0 active:bg-primary-active pressable"
          >
            Request a product
          </Link>
        </div>
      )}
    </div>
  );
}
