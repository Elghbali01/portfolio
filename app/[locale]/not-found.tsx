"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { isLocale, type Locale } from "@/i18n";

const copy: Record<Locale, { title: string; description: string; home: string; projects: string }> = {
  en: {
    title: "Page not found",
    description: "The page you requested does not exist or is no longer available.",
    home: "Return to the homepage",
    projects: "Browse all projects",
  },
  fr: {
    title: "Page introuvable",
    description: "La page demandée n’existe pas ou n’est plus disponible.",
    home: "Revenir à l’accueil",
    projects: "Voir tous les projets",
  },
  ar: {
    title: "الصفحة غير موجودة",
    description: "الصفحة التي طلبتها غير موجودة أو لم تعد متاحة.",
    home: "العودة إلى الصفحة الرئيسية",
    projects: "استعراض جميع المشاريع",
  },
};

export default function LocalizedNotFound() {
  const params = useParams<{ locale?: string }>();
  const locale: Locale = params.locale && isLocale(params.locale) ? params.locale : "en";
  const text = copy[locale];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center px-6 pb-16 pt-28 text-white"
    >
      <div className="max-w-xl text-center">
        <p className="text-7xl font-bold text-[#60A5FA]">404</p>
        <h1 className="mt-6 text-3xl font-bold md:text-5xl">{text.title}</h1>
        <p className="mt-4 leading-relaxed text-[#B7C3D4]">{text.description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}`}
            className="rounded-lg bg-[#2563EB] px-5 py-3 font-medium text-white transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            {text.home}
          </Link>
          <Link
            href={`/${locale}/projects`}
            className="rounded-lg border border-[#526176] px-5 py-3 font-medium text-[#D4DCE8] transition hover:border-[#60A5FA] hover:text-[#93C5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            {text.projects}
          </Link>
        </div>
      </div>
    </main>
  );
}
