import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/chatbot/ChatWidget";
import { getDictionary, getDirection, isLocale, locales, localeConfig } from "@/i18n";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const geist = localFont({
  src: "../../assets/fonts/Geist-Latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const notoArabic = localFont({
  src: "../../assets/fonts/NotoSansArabic-Arabic.woff2",
  variable: "--font-noto-arabic",
  weight: "100 900",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const dictionary = await getDictionary(value);

  return {
    metadataBase: siteUrl,
    title: dictionary.seo.defaultTitle,
    description: dictionary.seo.defaultDescription,
    applicationName: dictionary.common.siteName,
    authors: [{ name: dictionary.common.portfolioOwner }],
    creator: dictionary.common.portfolioOwner,
    icons: { icon: "/favicon.ico" },
    formatDetection: { email: false, address: false, telephone: false },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();

  const locale = value;
  const dictionary = await getDictionary(locale);
  const dir = getDirection(locale);

  return (
    <html lang={localeConfig[locale].htmlLang} dir={dir}>
      <body className={`${geist.variable} ${notoArabic.variable} min-h-screen bg-[#0B1120] text-white antialiased`}>
        <a
          href="#main-content"
          className="fixed start-4 top-3 z-[200] -translate-y-24 rounded-lg bg-white px-4 py-2 font-semibold text-[#0B1120] transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] motion-reduce:transition-none"
        >
          {dictionary.common.skipToContent}
        </a>
        <AnimatedBackground />
        <Navbar
          locale={locale}
          labels={{
            navigation: dictionary.navigation.ariaLabel,
            openMenu: dictionary.navigation.openMenu,
            closeMenu: dictionary.navigation.closeMenu,
            languageSwitcher: dictionary.languageSwitcher.label,
            sections: dictionary.navigation.sections,
          }}
        />
        {children}
        <Footer rights={dictionary.footer.rights} />
        <ChatWidget
          key={locale}
          locale={locale}
          labels={{
            suggestions: [...dictionary.chatbot.suggestions],
            welcome: dictionary.chatbot.welcome,
            dialogLabel: dictionary.chatbot.dialogLabel,
            title: dictionary.chatbot.title,
            status: dictionary.chatbot.subtitle,
            open: dictionary.chatbot.open,
            close: dictionary.chatbot.close,
            launcher: dictionary.chatbot.title,
            unreadOne: dictionary.chatbot.unreadOne,
            unreadMany: dictionary.chatbot.unreadMany,
            error: dictionary.chatbot.unavailable,
            user: dictionary.chatbot.userMessageLabel,
            assistant: dictionary.chatbot.assistantMessageLabel,
            thinking: dictionary.chatbot.thinking,
            input: {
              placeholder: dictionary.chatbot.inputPlaceholder,
              inputLabel: dictionary.chatbot.inputLabel,
              send: dictionary.chatbot.send,
              disclaimer: dictionary.chatbot.disclaimer,
            },
            resources: {
              ...dictionary.chatbot.resources.actions,
              opensNewTab: dictionary.common.opensInNewTab,
            },
          }}
        />
      </body>
    </html>
  );
}
