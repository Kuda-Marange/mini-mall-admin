import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Navbar } from "../../components/navbar";
import { SearchProvider } from "../../lib/search-context";
import { Toaster } from "../../components/ui/toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true";

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen} className="h-dvh">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar
            userName="Kudakwashe Marange"
            userImageUrl="https://github.com/shadcn.png"
            notificationCount={4}
          />
          <main className="flex-1 overflow-y-auto p-6 min-h-0 no-scrollbar">
            {children}
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </SearchProvider>
  );
}