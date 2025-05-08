
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactElement;
  title: string;
  isActive: boolean;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  title,
  isActive,
  isSidebarOpen,
  isMobile,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground",
        !isMobile && !isSidebarOpen && "lg:justify-center"
      )}
    >
      {icon}
      {(isMobile || isSidebarOpen) && title}
    </Link>
  );
};
