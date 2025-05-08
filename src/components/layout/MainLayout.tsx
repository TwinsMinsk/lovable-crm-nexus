
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { MainContent } from "./MainContent";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <AppSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header isMobile={isMobile} />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
}
