"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeConfig, themes, defaultTheme } from "./themes";

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (themeId: string) => void;
  allThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  allThemes: themes,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);

  // Sync CSS custom properties to document root so components outside
  // ThemeProvider (e.g. Header, Logo) can pick up theme colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--logo-from", currentTheme.logoFrom);
    root.style.setProperty("--logo-to", currentTheme.logoTo);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const found = themes.find((t) => t.id === themeId);
    if (found) setCurrentTheme(found);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, setTheme, allThemes: themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
