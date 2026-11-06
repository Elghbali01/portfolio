"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  appearanceStorageKey,
  defaultAppearance,
  defaultTheme,
  isAppearanceId,
  isThemeId,
  themeStorageKey,
  type AppearanceId,
  type ThemeId,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemeId;
  appearance: AppearanceId;
  ready: boolean;
  setTheme: (theme: ThemeId) => void;
  setAppearance: (appearance: AppearanceId) => void;
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

function getAppearanceSnapshot(): AppearanceId {
  const current = document.documentElement.dataset.appearance;
  return isAppearanceId(current) ? current : defaultAppearance;
}

function getReadySnapshot() {
  return providerReady;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => defaultTheme);
  const appearance = useSyncExternalStore(subscribe, getAppearanceSnapshot, () => defaultAppearance);
  const ready = useSyncExternalStore(subscribe, getReadySnapshot, () => false);
  const transitionTimer = useRef<number | null>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    try {
      const savedTheme = window.localStorage.getItem(themeStorageKey);
      const savedAppearance = window.localStorage.getItem(appearanceStorageKey);
      if (isThemeId(savedTheme)) root.dataset.theme = savedTheme;
      if (isAppearanceId(savedAppearance)) root.dataset.appearance = savedAppearance;
    } catch {
      // Keep the valid document preferences when storage is unavailable.
    }

    if (!isThemeId(document.documentElement.dataset.theme)) {
      document.documentElement.dataset.theme = defaultTheme;
    }
    if (!isAppearanceId(document.documentElement.dataset.appearance)) {
      document.documentElement.dataset.appearance = defaultAppearance;
    }
    providerReady = true;
    notifySubscribers();

    const syncPreference = (event: StorageEvent) => {
      if (event.key === themeStorageKey) {
        document.documentElement.dataset.theme = isThemeId(event.newValue) ? event.newValue : defaultTheme;
      } else if (event.key === appearanceStorageKey) {
        document.documentElement.dataset.appearance = isAppearanceId(event.newValue)
          ? event.newValue
          : defaultAppearance;
      } else {
        return;
      }
      notifySubscribers();
    };

    window.addEventListener("storage", syncPreference);
    return () => {
      window.removeEventListener("storage", syncPreference);
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

  const setAppearance = useCallback((nextAppearance: AppearanceId) => {
    if (!isAppearanceId(nextAppearance)) return;

    const root = document.documentElement;
    if (root.dataset.appearance !== nextAppearance) {
      root.dataset.themeTransitioning = "true";
      root.dataset.appearance = nextAppearance;
      notifySubscribers();
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(() => {
        delete root.dataset.themeTransitioning;
        transitionTimer.current = null;
      }, 360);
    }

    try {
      window.localStorage.setItem(appearanceStorageKey, nextAppearance);
    } catch {
      // The appearance remains active for this page view when storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({ theme, appearance, ready, setTheme, setAppearance }),
    [appearance, ready, setAppearance, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
