import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminSettings } from "@/lib/data/admin";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Shared storefront details. Changes appear across the site after saving."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
