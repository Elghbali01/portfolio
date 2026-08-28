export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];
export type TextDirection = "ltr" | "rtl";

export const defaultLocale: Locale = "en";

export const localeConfig = {
  en: {
    code: "en",
    htmlLang: "en",
    intlLocale: "en-US",
    direction: "ltr",
    autonym: "English",
    openGraphLocale: "en_US",
  },
  fr: {
    code: "fr",
    htmlLang: "fr",
    intlLocale: "fr-FR",
    direction: "ltr",
    autonym: "Français",
    openGraphLocale: "fr_FR",
  },
  ar: {
    code: "ar",
    htmlLang: "ar",
    intlLocale: "ar-MA",
    direction: "rtl",
    autonym: "العربية",
    openGraphLocale: "ar_MA",
  },
} as const satisfies Record<
  Locale,
  {
    code: Locale;
    htmlLang: string;
    intlLocale: string;
    direction: TextDirection;
    autonym: string;
    openGraphLocale: string;
  }
>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function assertLocale(value: string): asserts value is Locale {
  if (!isLocale(value)) {
    throw new RangeError(`Unsupported locale: ${value}`);
  }
}

export function getTextDirection(locale: Locale): TextDirection {
  return localeConfig[locale].direction;
}

/** Preferred public name used by locale-aware layouts. */
export const getDirection = getTextDirection;
