import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Navbar } from "../../components/navbar";
import { SearchProvider } from "../../lib/search-context";
import { Toaster } from "../../components/ui/toast";
import { createClient } from "../../lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name ?? user?.email ?? "Admin";
  const userEmail = user?.email;

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
  <div className="flex h-screen w-full overflow-hidden">
    <AppSidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar userName="Kudakwashe Marange" notificationCount={4} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
</SidebarProvider>
    </SearchProvider>
  );
}