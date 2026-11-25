"use client";

import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getWishlistServerSnapshot,
  getWishlistSnapshot,
  subscribeWishlist,
  toggleWishlist,
} from "@/lib/utils/wishlist";

export function WishlistButton({
  id,
  name,
  className = "",
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const ids = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot,
  );
  const saved = ids.includes(id);

  return (
    <button
      type="button"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface/90 text-ink/60 backdrop-blur transition-colors hover:border-brand hover:text-brand ${className}`}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(id);
      }}
    >
      <Heart
        aria-hidden="true"
        className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`}
      />
    </button>
  );
}
