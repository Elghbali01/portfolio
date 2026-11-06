"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { AppearanceId } from "@/lib/theme";

export interface AppearanceSwitcherLabels {
  label: string;
  switchToLight: string;
  switchToDark: string;
  light: string;
  dark: string;
}

interface AppearanceSwitcherProps {
  labels: AppearanceSwitcherLabels;
}

export default function AppearanceSwitcher({ labels }: AppearanceSwitcherProps) {
  const { appearance, ready, setAppearance } = useTheme();
  const nextAppearance: AppearanceId = appearance === "dark" ? "light" : "dark";
  const actionLabel = appearance === "dark" ? labels.switchToLight : labels.switchToDark;
  const Icon = appearance === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      disabled={!ready}
      aria-label={actionLabel}
      aria-pressed={appearance === "light"}
      title={labels.label + ": " + actionLabel}
      onClick={() => setAppearance(nextAppearance)}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline-default bg-surface text-content-secondary transition-colors hover:border-accent hover:bg-surface-elevated hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 xl:h-10 xl:w-10"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}
