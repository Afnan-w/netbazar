export const WISHLIST_STORAGE_KEY = "netbazar:wishlist";
export const WISHLIST_EVENT = "netbazar:wishlist-change";

let snapshot: string[] = [];
let loaded = false;
const serverSnapshot: string[] = [];

function parseWishlist(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function readWishlist(): string[] {
  if (typeof window === "undefined") return snapshot;
  if (!loaded) {
    snapshot = parseWishlist();
    loaded = true;
  }
  return snapshot;
}

export function writeWishlist(ids: string[]): void {
  snapshot = ids;
  loaded = true;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export function toggleWishlist(id: string): string[] {
  const current = readWishlist();
  const next = current.includes(id)
    ? current.filter((entry) => entry !== id)
    : [...current, id];
  writeWishlist(next);
  return next;
}

export function subscribeWishlist(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = () => {
    loaded = false;
    callback();
  };
  window.addEventListener(WISHLIST_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(WISHLIST_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getWishlistSnapshot(): string[] {
  return readWishlist();
}

export function getWishlistServerSnapshot(): string[] {
  return serverSnapshot;
}
