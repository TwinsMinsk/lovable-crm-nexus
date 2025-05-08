
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// Define a proper interface for our ThemeProvider that includes children
interface Props extends ThemeProviderProps {
  children: React.ReactNode;
}

// Export the ThemeProvider component that explicitly accepts children as a prop
export function ThemeProvider({ children, ...props }: Props) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
