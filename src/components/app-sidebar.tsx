import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BarChart3, FileText, Handshake, Landmark } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { pb } from "@/lib/pocketbase";

const data = {
  navMain: [
    {
      title: "Deals",
      url: "/deals",
      icon: Handshake,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = pb.authStore.model
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/">
                <Landmark size={5} />
                <span className="text-base font-semibold">MCA Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Link to="/deals/create">
          <Button variant={"outline"} className="w-full">
            New Deal
          </Button>
        </Link>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser email={user?.email} />
      </SidebarFooter>
    </Sidebar>
  );
}
