import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/admin/auth/session";
import { PanelShell } from "@/components/admin/shell/PanelShell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = decodeSession(sessionToken);

  if (!user) {
    redirect("/admin/login");
  }

  return <PanelShell user={user}>{children}</PanelShell>;
}

