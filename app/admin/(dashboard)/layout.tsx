import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import type { ReactNode } from "react";

// Admin pages always read live session and sourcing data.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
