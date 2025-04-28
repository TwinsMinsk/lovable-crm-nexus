
import { 
  Home, 
  UserPlus, 
  Users, 
  ShoppingCart, 
  ClipboardList, 
  Calendar, 
  Package, 
  Building, 
  Settings 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// Menu items
const menuItems = [
  { title: "Дашборд", url: "/dashboard", icon: Home },
  { title: "Лиды", url: "/leads", icon: UserPlus },
  { title: "Контакты", url: "/contacts", icon: Users },
  { title: "Заказы", url: "/orders", icon: ShoppingCart },
  { title: "Задачи", url: "/tasks", icon: ClipboardList },
  { title: "Календарь", url: "/calendar", icon: Calendar },
  { title: "Товары", url: "/products", icon: Package },
  { title: "Партнеры", url: "/partners", icon: Building },
  { title: "Настройки", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center px-6">
          <h1 className="font-bold text-xl">CRM Nexus</h1>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Основное меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
