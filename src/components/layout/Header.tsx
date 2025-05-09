
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isMobile: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { signOut } = useAuth();
  const { setOpen } = useSidebar();

  const toggleMobileMenu = () => {
    if (isMobile) {
      setOpen(true);
    }
  };

  return (
    <header className="border-b h-14 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className={cn("font-semibold", isMobile ? "ml-4" : "")}>CRM Lomuebles</div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <Button variant="ghost" onClick={signOut} className="flex gap-2 items-center">
          <span>Выход</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
