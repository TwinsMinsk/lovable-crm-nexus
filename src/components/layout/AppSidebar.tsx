
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavSection } from "./navigation/NavSection";
import { IntegrationsSection } from "./navigation/IntegrationsSection";
import { LogoutButton } from "./navigation/LogoutButton";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const { open: isSidebarOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r bg-background transition-transform",
        isMobile ? 
          (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : 
          (isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
        !isMobile && !isSidebarOpen && "lg:w-16"
      )}
    >
      {/* Header */}
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
      </div>
      
      {/* Navigation Content */}
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          <NavSection isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
          <IntegrationsSection isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
        </nav>
      </ScrollArea>
      
      {/* Footer */}
      <div className="mt-auto p-2">
        <LogoutButton isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
      </div>
    </div>
  );
}
