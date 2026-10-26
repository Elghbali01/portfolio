"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { defaultTheme, isThemeId, themeStorageKey, type ThemeId } from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemeId;
  ready: boolean;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const subscribers = new Set<() => void>();
let providerReady = false;

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers() {
  subscribers.forEach((callback) => callback());
}

function getThemeSnapshot(): ThemeId {
  const current = document.documentElement.dataset.theme;
  return isThemeId(current) ? current : defaultTheme;
}

function getReadySnapshot() {
  return providerReady;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => defaultTheme);
  const ready = useSyncExternalStore(subscribe, getReadySnapshot, () => false);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isThemeId(document.documentElement.dataset.theme)) {
      document.documentElement.dataset.theme = defaultTheme;
    }
    providerReady = true;
    notifySubscribers();

    const syncTheme = (event: StorageEvent) => {
      if (event.key !== themeStorageKey) return;
      document.documentElement.dataset.theme = isThemeId(event.newValue) ? event.newValue : defaultTheme;
      notifySubscribers();
    };

    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
      providerReady = false;
    };
  }, []);

  const setTheme = useCallback((nextTheme: ThemeId) => {
    if (!isThemeId(nextTheme)) return;

    const root = document.documentElement;
    if (root.dataset.theme !== nextTheme) {
      root.dataset.themeTransitioning = "true";
      root.dataset.theme = nextTheme;
      notifySubscribers();
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(() => {
        delete root.dataset.themeTransitioning;
        transitionTimer.current = null;
      }, 360);
    }

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The theme remains active for this page view when storage is unavailable.
    }
  }, []);

  const value = useMemo(() => ({ theme, ready, setTheme }), [ready, setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
