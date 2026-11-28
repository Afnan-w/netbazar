import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminCategories } from "@/lib/data/admin";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="New product"
        description="Add a sourcing example. It starts as a draft until you set it to available."
      />
      <ProductForm categories={categories} />
    </div>
  );
}
