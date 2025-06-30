"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../icon";
import useAuthStore from "@/stores/auth-store";

const routes = [
  {
    name: "Roster",
    path: "/roster/month-view",
    icon: "CalendarDays",
    role: ["user", "employee"],
  },
  {
    name: "Timesheet",
    path: "/timesheet",
    icon: "Clock",
    role: ["user", "employee"],
  },
  {
    name: "Employees",
    path: "/employees",
    icon: "Users",
    role: ["user"],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) {
    return;
  }

  return (
    <Sidebar className="z-41">
      <SidebarHeader className="py-5">
        <Link href={"/dashboard"}>
          <div className="flex items-center justify-center space-x-0.5">
            <Image src={"/logo.svg"} alt="Schedoule" width={25} height={25} />
            <span className="text-xl font-bold text-indigo-600">chedoule</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href={"/dashboard"}>
                  <House />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-wider">
            MANAGE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map(
                (route, key) =>
                  route.role.includes(user.role) && (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === route.path}
                      >
                        <Link href={route.path}>
                          <Icon name={route.icon} />
                          <span>{route.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
