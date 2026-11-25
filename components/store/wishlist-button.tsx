"use client";

import { Check, Heart } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
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
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <button
        type="button"
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-secondary-ink shadow-card backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card-hover active:translate-y-0 active:scale-95 pressable ${className}`}
        aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
        aria-pressed={saved}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleWishlist(id);
          setToast(saved ? "Removed from wishlist" : "Saved to wishlist");
        }}
      >
        <Heart
          aria-hidden="true"
          className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`}
        />
      </button>

      {toast && (
        <span
          role="status"
          aria-live="polite"
          className="toast-pop pointer-events-none fixed bottom-5 left-1/2 z-[60] inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-surface shadow-card-hover"
        >
          <Check aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
          {toast}
        </span>
      )}
    </>
  );
}
