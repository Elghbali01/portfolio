import type { Locale } from "@/i18n/config";

interface DirectionalArrowProps {
  locale: Locale;
  direction: "back" | "forward";
  className?: string;
}

export default function DirectionalArrow({
  locale,
  direction,
  className = "h-4 w-4",
}: DirectionalArrowProps) {
  const pointsRight = (locale !== "ar" && direction === "forward") || (locale === "ar" && direction === "back");

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={pointsRight ? "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" : "M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}
      />
    </svg>
  );
}
