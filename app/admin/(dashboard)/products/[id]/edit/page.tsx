import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageManager } from "@/components/admin/image-manager";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { buttonClass } from "@/components/ui/button";
import { getAdminCategories, getAdminProduct } from "@/lib/data/admin";

type EditProductPageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Edit product"
        description={`SKU ${product.sku} · Last updated ${new Date(product.updated_at).toLocaleDateString("en-GB")}`}
        action={
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ variant: "secondary", pill: true })}
          >
            View on site
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />
      <div className="space-y-6">
        <ProductForm product={product} categories={categories} />
        <ImageManager productId={product.id} images={product.images} />
      </div>
    </div>
  );
}
