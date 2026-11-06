"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import NavbarDropdown, { NavbarMenuItem } from "@/components/NavbarDropdown";

const autonyms: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  onNavigate?: () => void;
}

function replaceLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }
  return `/${locale}`;
}

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getHashSnapshot() {
  return window.location.hash;
}

export default function LanguageSwitcher({
  locale,
  label,
  onNavigate,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeToHash, getHashSnapshot, () => "");

  const query = searchParams.toString();

  return (
    <NavbarDropdown label={label} icon={Languages}>
      {locales.map((candidate) => {
        const path = replaceLocale(pathname, candidate);
        const href = path + (query ? "?" + query : "") + hash;

        return (
          <NavbarMenuItem
            key={candidate}
            href={href}
            lang={candidate}
            dir={candidate === "ar" ? "rtl" : "ltr"}
            selectable
            selected={candidate === locale}
            onSelect={onNavigate}
          >
            {autonyms[candidate]}
          </NavbarMenuItem>
        );
      })}
    </NavbarDropdown>
  );
}
