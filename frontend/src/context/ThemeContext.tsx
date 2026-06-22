"use client";

import type React from "react";

import { createContext, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always use light mode
  const theme: Theme = "light";

  useEffect(() => {
    // Keep localStorage clean and ensure the dark class is removed
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    // Always keep it light, do nothing when toggle is called
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
