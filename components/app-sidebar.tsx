import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "../components/ui/sidebar";
import { navItems } from "../lib/nav-items";
import { Settings } from "lucide-react";
import Link from "next/link";
import { SidebarHeaderBlock } from "./sidebar-header-snippet"


export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderBlock name="Kudakwashe Marange" email="kudakwashemarange4@gmail.com" imageUrl="https://github.com/shadcn.png"/>

      <SidebarContent>
        <SidebarSeparator className="mt-2 mb-4"/>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild>
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
