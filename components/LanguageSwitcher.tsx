"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";

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
    <div
      role="group"
      className="flex items-center gap-1 rounded-xl border border-[#475569] bg-[#0B1120]/80 p-1"
      aria-label={label}
    >
      <Languages aria-hidden="true" size={15} className="mx-1 text-[#93C5FD]" />
      {locales.map((candidate) => {
        const path = replaceLocale(pathname, candidate);
        const href = `${path}${query ? `?${query}` : ""}${hash}`;

        return (
          <Link
            key={candidate}
            href={href}
            hrefLang={candidate}
            lang={candidate}
            dir={candidate === "ar" ? "rtl" : "ltr"}
            aria-current={candidate === locale ? "page" : undefined}
            onClick={onNavigate}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] ${
              candidate === locale
                ? "bg-[#2563EB] text-white"
                : "text-[#CBD5E1] hover:bg-white/10 hover:text-white"
            }`}
          >
            {autonyms[candidate]}
          </Link>
        );
      })}
    </div>
  );
}
