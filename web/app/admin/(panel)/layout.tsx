import { redirect } from "next/navigation";
import { PanelShell } from "@/components/admin/shell/PanelShell";
import { resolveUserRole, toSessionUser } from "@/lib/admin/auth/supabase-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?reason=expired");
  }

  const role = resolveUserRole(user);
  if (!role) {
    redirect("/admin/akses-ditolak");
  }

  return <PanelShell user={toSessionUser(user, role)}>{children}</PanelShell>;
}
