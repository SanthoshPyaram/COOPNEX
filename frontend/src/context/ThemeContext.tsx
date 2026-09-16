import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("sahakari_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    } catch {
      // fallback
    }
    return "light";
  });

  // Listen for system preference changes if user hasn't explicitly set theme
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const userHasCustomSaved = localStorage.getItem("sahakari_theme");
      if (!userHasCustomSaved) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const isDark = theme === "dark";

    if (isDark) {
      root.classList.add("dark");
      if (body) body.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
      root.style.setProperty("--theme-bg", "#050B17");
      root.style.setProperty("--theme-surface", "#0A1128");
      root.style.setProperty("--theme-card", "#0F172A");
      root.style.setProperty("--theme-border", "#1E293B");
      root.style.setProperty("--theme-text", "#F8FAFC");
      root.style.setProperty("--theme-muted", "#94A3B8");
      if (body) {
        body.style.backgroundColor = "#050B17";
        body.style.color = "#F8FAFC";
      }
    } else {
      root.classList.remove("dark");
      if (body) body.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
      root.style.setProperty("--theme-bg", "#F8FAFC");
      root.style.setProperty("--theme-surface", "#FFFFFF");
      root.style.setProperty("--theme-card", "#FFFFFF");
      root.style.setProperty("--theme-border", "#E2E8F0");
      root.style.setProperty("--theme-text", "#0F172A");
      root.style.setProperty("--theme-muted", "#64748B");
      if (body) {
        body.style.backgroundColor = "#F8FAFC";
        body.style.color = "#0F172A";
      }
    }
    try {
      localStorage.setItem("sahakari_theme", theme);
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
