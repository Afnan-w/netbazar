"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "netbazar-theme";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable in private browsing; the in-memory theme still applies.
  }
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

  return {
    theme,
    setTheme: commit,
    toggleTheme: () => commit(theme === "dark" ? "light" : "dark"),
  };
}
