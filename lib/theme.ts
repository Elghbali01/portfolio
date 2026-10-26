export const themeIds = [
  "original-blue",
  "royal-violet",
  "emerald-tech",
  "midnight-gold",
  "crimson-night",
] as const;

export type ThemeId = (typeof themeIds)[number];

export const defaultTheme: ThemeId = "original-blue";
export const themeStorageKey = "portfolio-theme-v1";

export const themeSwatches: Record<ThemeId, readonly [string, string, string]> = {
  "original-blue": ["#0B1120", "#60A5FA", "#2563EB"],
  "royal-violet": ["#100D20", "#A78BFA", "#6D28D9"],
  "emerald-tech": ["#071B1A", "#5EEAD4", "#0F766E"],
  "midnight-gold": ["#141414", "#FBBF24", "#92400E"],
  "crimson-night": ["#170C14", "#FDA4AF", "#9F1239"],
};

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value != null && (themeIds as readonly string[]).includes(value);
}
