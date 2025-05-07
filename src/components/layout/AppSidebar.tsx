
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Users, Phone, ShoppingCart, CalendarDays, CheckSquare, Package2, Building2, BarChart3, Truck } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar, SidebarRail } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
export function AppSidebar() {
  const {
    signOut
  } = useAuth();
  const location = useLocation();
  const {
    state,
    openMobile,
    setOpenMobile
  } = useSidebar();
  const isMobile = useIsMobile();

  // Функция для определения активного состояния элемента меню
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Закрывает мобильное меню после перехода по ссылке
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  return <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className={cn("transition-all duration-200", state === "collapsed" ? "scale-75" : "scale-100")}>
          <h2 className="font-bold text-xl text-primary">CRM Lomeubles</h2>
        </div>
      </SidebarHeader>
      <SidebarRail />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/dashboard') ? 'bg-muted' : ''} tooltip="Дашборд">
                  <Link to="/dashboard" onClick={handleLinkClick}>
                    <Home className="h-5 w-5" />
                    <span>Дашборд</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/leads') ? 'bg-muted' : ''} tooltip="Лиды">
                  <Link to="/leads" onClick={handleLinkClick}>
                    <Phone className="h-5 w-5" />
                    <span>Лиды</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/contacts') ? 'bg-muted' : ''} tooltip="Контакты">
                  <Link to="/contacts" onClick={handleLinkClick}>
                    <Users className="h-5 w-5" />
                    <span>Контакты</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/orders') ? 'bg-muted' : ''} tooltip="Заказы">
                  <Link to="/orders" onClick={handleLinkClick}>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Заказы</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/tasks') ? 'bg-muted' : ''} tooltip="Задачи">
                  <Link to="/tasks" onClick={handleLinkClick}>
                    <CheckSquare className="h-5 w-5" />
                    <span>Задачи</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/calendar') ? 'bg-muted' : ''} tooltip="Календарь">
                  <Link to="/calendar" onClick={handleLinkClick}>
                    <CalendarDays className="h-5 w-5" />
                    <span>Календарь</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/reports') ? 'bg-muted' : ''} tooltip="Отчеты">
                  <Link to="/reports" onClick={handleLinkClick}>
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
                <SidebarMenuButton asChild className={isActive('/products') ? 'bg-muted' : ''} tooltip="Товары">
                  <Link to="/products" onClick={handleLinkClick}>
                    <Package2 className="h-5 w-5" />
                    <span>Товары</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/partners') ? 'bg-muted' : ''} tooltip="Партнеры">
                  <Link to="/partners" onClick={handleLinkClick}>
                    <Building2 className="h-5 w-5" />
                    <span>Партнеры</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/suppliers') ? 'bg-muted' : ''} tooltip="Поставщики">
                  <Link to="/suppliers" onClick={handleLinkClick}>
                    <Truck className="h-5 w-5" />
                    <span>Поставщики</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}
