import type { Metadata } from "next";
import { WishlistView } from "@/components/store/wishlist-view";
import { getProducts } from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Saved examples",
  description: "Sourcing examples you saved on Netbazar.",
};

export default async function WishlistPage() {
  const result = await getProducts({ availability: "available", pageSize: 48 });

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-primary-tint/30 to-page">
      <WishlistView products={result.items} />
    </div>
  );
}
