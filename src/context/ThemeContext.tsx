import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../db/db";

export type ThemeMode = "default" | "light" | "blue";

export interface IThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  inputBg: string;
  glow: string;
  isDark: boolean;
  statusBar: "light-content" | "dark-content";
}

export const themeColors: Record<ThemeMode, IThemeColors> = {
  default: {
    primary: "#6F1D3A",
    background: "#606066",
    card: "#15151cec",
    text: "#FFFFFF",
    subText: "#A0A0AA",
    border: "rgba(255,255,255,0.05)",
    inputBg: "#121218",
    glow: "rgba(111,29,58,0.18)",
    isDark: true,
    statusBar: "light-content",
  },
  light: {
    primary: "#6F1D3A",
    background: "#F3F4F6",
    card: "#FFFFFF",
    text: "#1F2937",
    subText: "#6B7280",
    border: "rgba(0,0,0,0.08)",
    inputBg: "#E5E7EB",
    glow: "rgba(111,29,58,0.06)",
    isDark: false,
    statusBar: "dark-content",
  },
  blue: {
    primary: "#3B82F6",
    background: "#0B132B",
    card: "#1C2541",
    text: "#F8FAFC",
    subText: "#8D99AE",
    border: "rgba(255,255,255,0.06)",
    inputBg: "#0B0F19",
    glow: "rgba(59,130,246,0.18)",
    isDark: true,
    statusBar: "light-content",
  },
};

interface IThemeContext {
  themeMode: ThemeMode;
  colors: IThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<IThemeContext>({
  themeMode: "default",
  colors: themeColors.default,
  setThemeMode: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("default");

  useEffect(() => {
    async function loadTheme() {
      try {
        const result = await db.getFirstAsync<{ value: string }>(
          `SELECT value FROM settings WHERE key = 'app_theme'`
        );
        if (result && (result.value === "light" || result.value === "blue" || result.value === "default")) {
          setThemeModeState(result.value as ThemeMode);
        }
      } catch (error) {
        console.error("Error loading theme from DB:", error);
      }
    }
    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await db.runAsync(
        `INSERT OR REPLACE INTO settings (key, value) VALUES ('app_theme', ?)`,
        [mode]
      );
    } catch (error) {
      console.error("Error saving theme to DB:", error);
    }
  };

  const colors = themeColors[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
