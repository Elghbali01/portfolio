"use client";

import { Check, Palette } from "lucide-react";
import { themeIds, themeSwatches, type ThemeId } from "@/lib/theme";
import { useTheme } from "@/components/ThemeProvider";

interface ThemeSwitcherProps {
  label: string;
  themes: Record<ThemeId, string>;
}

export default function ThemeSwitcher({ label, themes }: ThemeSwitcherProps) {
  const { theme, ready, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label={label}
      aria-hidden={!ready}
      className={`flex items-center gap-1 rounded-xl border border-outline-default bg-surface p-1 ${ready ? "" : "invisible"}`}
    >
      <Palette aria-hidden="true" size={15} className="mx-1 shrink-0 text-accent-soft" />
      {themeIds.map((themeId) => {
        const selected = themeId === theme;
        const [canvas, accent, action] = themeSwatches[themeId];

        return (
          <button
            key={themeId}
            type="button"
            disabled={!ready}
            aria-label={themes[themeId]}
            aria-pressed={selected}
            title={themes[themeId]}
            onClick={() => setTheme(themeId)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              selected ? "border-accent bg-surface-elevated" : "border-transparent hover:bg-surface-elevated"
            }`}
          >
            <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-content-primary/25" aria-hidden="true">
              <span className="absolute inset-0" style={{ background: canvas }} />
              <span className="absolute inset-y-0 start-0 w-1/2" style={{ background: accent }} />
              <span className="absolute inset-y-0 end-0 w-1/2" style={{ background: action }} />
              {selected && <Check className="relative z-10 h-3 w-3 text-content-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
