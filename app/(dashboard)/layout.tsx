import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Navbar } from "../../components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = sidebarState === undefined ? true : sidebarState === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-screen">
  <AppSidebar />
  <div className="flex flex-1 flex-col overflow-hidden">
    <Navbar userName="Kudakwashe Marange" notificationCount={4} />
    <main className="flex-1 overflow-y-auto p-6">{children}</main>
  </div>
</SidebarProvider>
  );
}
