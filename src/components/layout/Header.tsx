
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface HeaderProps {
  isMobile: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { signOut } = useAuth();

  return (
    <header className="border-b h-14 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        <SidebarTrigger />
        {!isMobile && <div className="ml-4 font-semibold">CRM Lomuebles</div>}
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
