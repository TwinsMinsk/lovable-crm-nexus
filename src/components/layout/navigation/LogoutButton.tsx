
import React from "react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface LogoutButtonProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  isSidebarOpen,
  isMobile,
}) => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
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
  );
};
