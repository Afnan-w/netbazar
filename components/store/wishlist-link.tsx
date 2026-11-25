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
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition-all hover:scale-105 hover:border-action hover:text-action"
    >
      <Heart aria-hidden="true" className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-action px-1 text-[10px] font-semibold text-dark">
          {count}
        </span>
      )}
    </Link>
  );
}
