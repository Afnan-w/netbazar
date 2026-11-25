"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/use-theme";

export function ThemeToggle({
  compact = false,
  labelClassName = "",
}: {
  compact?: boolean;
  labelClassName?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Light Mode" : "Dark Mode"}`}
      aria-pressed={isDark}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-border bg-surface text-secondary-ink transition-all hover:border-primary/30 hover:text-primary pressable ${
        compact ? "w-11" : "px-3"
      }`}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4" />
      )}
      {!compact && (
        <span className={`text-xs font-medium ${labelClassName}`}>
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
