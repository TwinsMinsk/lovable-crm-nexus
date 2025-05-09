
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface MainContentProps {
  children?: ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="p-6 overflow-auto flex-1 w-full">
      {children || <Outlet />}
    </main>
  );
};
