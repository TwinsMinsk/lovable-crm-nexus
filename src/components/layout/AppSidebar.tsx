
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Users, Phone, ShoppingCart, CalendarDays, CheckSquare, Package2, Building2, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();
  
  // Функция для определения активного состояния элемента меню
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/dashboard') ? 'bg-muted' : ''}>
                  <Link to="/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Дашборд</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/leads') ? 'bg-muted' : ''}>
                  <Link to="/leads">
                    <Phone className="h-5 w-5" />
                    <span>Лиды</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/contacts') ? 'bg-muted' : ''}>
                  <Link to="/contacts">
                    <Users className="h-5 w-5" />
                    <span>Контакты</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/orders') ? 'bg-muted' : ''}>
                  <Link to="/orders">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Заказы</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/tasks') ? 'bg-muted' : ''}>
                  <Link to="/tasks">
                    <CheckSquare className="h-5 w-5" />
                    <span>Задачи</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/calendar') ? 'bg-muted' : ''}>
                  <Link to="/calendar">
                    <CalendarDays className="h-5 w-5" />
                    <span>Календарь</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/reports') ? 'bg-muted' : ''}>
                  <Link to="/reports">
                    <BarChart3 className="h-5 w-5" />
                    <span>Отчеты</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Каталог</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/products') ? 'bg-muted' : ''}>
                  <Link to="/products">
                    <Package2 className="h-5 w-5" />
                    <span>Товары</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/partners') ? 'bg-muted' : ''}>
                  <Link to="/partners">
                    <Building2 className="h-5 w-5" />
                    <span>Партнеры</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
