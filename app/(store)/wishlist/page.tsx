import type { Metadata } from "next";
import { WishlistView } from "@/components/store/wishlist-view";
import { getProducts, getSiteSettings } from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you saved on Netbazar.",
};

export default async function WishlistPage() {
  const [result, settings] = await Promise.all([
    getProducts({ availability: "available", pageSize: 48 }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-primary-tint/30 to-page">
      <WishlistView
        products={result.items}
        whatsappNumber={settings.whatsapp_number}
      />
    </div>
  );
}
