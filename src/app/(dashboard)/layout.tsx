import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { SidebarWrapper } from "@/components/layout/sidebar-wrapper";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <SidebarWrapper />
      <main className="ml-[220px] flex-1 min-h-screen relative overflow-hidden">
        <DashboardShell>{children}</DashboardShell>
      </main>
    </div>
  );
}
