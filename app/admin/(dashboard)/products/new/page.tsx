import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminCategories } from "@/lib/data/admin";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <PageHeader
        title="New product"
        description="Add a listing to the catalogue. It starts as a draft until you set it to available."
      />
      <ProductForm categories={categories} />
    </div>
  );
}
