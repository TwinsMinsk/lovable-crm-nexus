
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b h-14 flex items-center justify-between px-6">
            <div className="flex items-center">
              <SidebarTrigger />
              {!isMobile && <div className="ml-4 font-semibold">CRM Nexus</div>}
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Button variant="ghost" onClick={signOut} className="flex gap-2 items-center">
                <span>Выйти</span>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
