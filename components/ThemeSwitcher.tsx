"use client";

import { Palette } from "lucide-react";
import { themeIds, themeSwatches, type ThemeId } from "@/lib/theme";
import { useTheme } from "@/components/ThemeProvider";
import NavbarDropdown, { NavbarMenuItem } from "@/components/NavbarDropdown";

interface ThemeSwitcherProps {
  label: string;
  themes: Record<ThemeId, string>;
}

export default function ThemeSwitcher({ label, themes }: ThemeSwitcherProps) {
  const { theme, ready, setTheme } = useTheme();

  return (
    <NavbarDropdown label={label} icon={Palette} disabled={!ready}>
      {themeIds.map((themeId) => {
        const selected = themeId === theme;
        const [canvas, accent, action] = themeSwatches[themeId];

        return (
          <NavbarMenuItem
            key={themeId}
            selectable
            selected={selected}
            onSelect={() => setTheme(themeId)}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full border border-content-primary/25"
                aria-hidden="true"
              >
                <span className="absolute inset-0" style={{ background: canvas }} />
                <span className="absolute inset-y-0 start-0 w-1/2" style={{ background: accent }} />
                <span className="absolute inset-y-0 end-0 w-1/2" style={{ background: action }} />
              </span>
              <span className="truncate">{themes[themeId]}</span>
            </span>
          </NavbarMenuItem>
        );
      })}
    </NavbarDropdown>
  );
}
