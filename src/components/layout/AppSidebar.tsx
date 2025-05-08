
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Phone,
  Users,
  ShoppingBag,
  Calendar,
  ClipboardList,
  BarChart3,
  Package,
  Handshake,
  Truck,
  Settings,
  LogOut,
  PanelLeft,
  PanelRight,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function AppSidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const { isMobile } = useMobile();

  const handleSignOut = () => {
    signOut();
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Лиды",
      href: "/dashboard/leads",
      icon: <Phone className="mr-2 h-4 w-4" />,
    },
    {
      title: "Контакты",
      href: "/dashboard/contacts",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Заказы",
      href: "/dashboard/orders",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
    },
    {
      title: "Задачи",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
    },
    {
      title: "Календарь",
      href: "/dashboard/calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Товары",
      href: "/dashboard/products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      title: "Партнеры",
      href: "/dashboard/partners",
      icon: <Handshake className="mr-2 h-4 w-4" />,
    },
    {
      title: "Поставщики",
      href: "/dashboard/suppliers",
      icon: <Truck className="mr-2 h-4 w-4" />,
    },
    {
      title: "Отчеты",
      href: "/dashboard/reports",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
  ];

  // Integrations submenu
  const integrations = [
    {
      title: "Tilda",
      href: "/dashboard/integrations/tilda",
      icon: <Plug className="mr-2 h-4 w-4" />,
    }
  ];
  
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r bg-background transition-transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !isMobile && !isSidebarOpen && "lg:w-16"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center font-semibold",
            !isMobile && !isSidebarOpen && "lg:justify-center"
          )}
        >
          {isMobile || isSidebarOpen ? "CRM-система" : "CRM"}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          onClick={toggleSidebar}
        >
          <PanelRight className="h-4 w-4" />
        </Button>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ||
                  (pathname.startsWith(item.href) && item.href !== "/dashboard")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                !isMobile && !isSidebarOpen && "lg:justify-center"
              )}
            >
              {item.icon}
              {(isMobile || isSidebarOpen) && item.title}
            </Link>
          ))}
          
          {/* Integrations Accordion - Show only when sidebar is expanded */}
          {(isMobile || isSidebarOpen) ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="integrations" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:no-underline rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Plug className="mr-2 h-4 w-4" />
                    Интеграции
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="flex flex-col space-y-1 pl-6">
                    {integrations.map((integration, index) => (
                      <Link
                        key={index}
                        to={integration.href}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === integration.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {integration.icon}
                        {integration.title}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            // Simplified icon-only version for collapsed sidebar
            <Link
              to="/dashboard/integrations/tilda"
              className={cn(
                "flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.includes("/integrations")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Plug className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground",
            !isMobile && !isSidebarOpen && "lg:justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {(isMobile || isSidebarOpen) && "Выйти"}
        </Button>
      </div>
    </div>
  );
}
