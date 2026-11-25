import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data/store";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { ReactNode } from "react";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts({ availability: "available", pageSize: 24 }),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Netbazar, I would like to know more about your products.",
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        categories={categories.map(({ name, slug }) => ({ name, slug }))}
        suggestions={products.items.map((product) => ({
          name: product.name,
          slug: product.slug,
          category: product.category?.name,
        }))}
        whatsappUrl={whatsappUrl}
      />
      <main className="flex-1 bg-page">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
