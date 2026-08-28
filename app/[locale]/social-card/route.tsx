import { ImageResponse } from "next/og";
import { getDictionary, isLocale } from "@/i18n";

export const runtime = "edge";

const notoSansArabicRegular = fetch(
  new URL("../../../assets/fonts/NotoSansArabic-Legacy-Regular.ttf", import.meta.url),
).then((response) => response.arrayBuffer());

const notoSansArabicBold = fetch(
  new URL("../../../assets/fonts/NotoSansArabic-Legacy-Bold.ttf", import.meta.url),
).then((response) => response.arrayBuffer());

interface SocialCardContext {
  params: Promise<{ locale: string }>;
}

export async function GET(_request: Request, { params }: SocialCardContext) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const dictionary = await getDictionary(locale);
  const rtl = locale === "ar";
  const arabicFonts = rtl
    ? await Promise.all([notoSansArabicRegular, notoSansArabicBold])
    : null;

  return new ImageResponse(
    (
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "78px 88px",
          color: "white",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 58%, #312e81 100%)",
          fontFamily: rtl ? "Noto Sans Arabic" : "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 25, color: "#93c5fd" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#60a5fa" }} />
          {dictionary.common.siteName}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 990 }}>
          <div style={{ display: "flex", fontSize: 70, fontWeight: 700, letterSpacing: rtl ? 0 : -2 }}>
            {dictionary.hero.name}
          </div>
          <div style={{ display: "flex", fontSize: 36, lineHeight: 1.35, color: "#dbeafe" }}>
            {dictionary.hero.stableHeadline}
          </div>
        </div>
        <div style={{ display: "flex", gap: 26, fontSize: 23, color: "#cbd5e1" }}>
          <span>Next.js</span>
          <span>Spring Boot</span>
          <span>Python</span>
          <span>Machine Learning</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: arabicFonts
        ? [
            { name: "Noto Sans Arabic", data: arabicFonts[0], weight: 400 },
            { name: "Noto Sans Arabic", data: arabicFonts[1], weight: 700 },
          ]
        : undefined,
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    },
  );
}
