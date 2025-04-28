
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="border-b h-14 flex items-center justify-end px-6">
            <Button variant="ghost" onClick={signOut} className="flex gap-2 items-center">
              <span>Выйти</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
