
import React from "react";
import { useLocation } from "react-router-dom";
import { NavItem } from "./NavItem";
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
} from "lucide-react";

interface NavSectionProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const NavSection: React.FC<NavSectionProps> = ({
  isSidebarOpen,
  isMobile,
}) => {
  const { pathname } = useLocation();

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

  return (
    <>
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          href={item.href}
          icon={item.icon}
          title={item.title}
          isActive={
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/dashboard")
          }
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};
