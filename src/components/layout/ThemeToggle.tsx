"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-text-muted hover:text-text hover:bg-elevated transition-colors duration-200"
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title="테마 전환"
    >
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
