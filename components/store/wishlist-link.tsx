"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getWishlistServerSnapshot,
  getWishlistSnapshot,
  subscribeWishlist,
} from "@/lib/utils/wishlist";

export function WishlistLink() {
  const ids = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot,
  );
  const count = ids.length;

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${count} saved ${count === 1 ? "product" : "products"}`}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-secondary-ink shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card-hover active:translate-y-0 pressable"
    >
      <Heart aria-hidden="true" className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white shadow-card ring-2 ring-surface">
          {count}
        </span>
      )}
    </Link>
  );
}
