import { assertLocale, type Locale } from "./config";
import type { Dictionary } from "./types";

export type { Dictionary } from "./types";

type DictionaryModule = { default: Dictionary };

const dictionaryLoaders: Record<Locale, () => Promise<DictionaryModule>> = {
  en: () => import("./dictionaries/en"),
  fr: () => import("./dictionaries/fr"),
  ar: () => import("./dictionaries/ar"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaryModule = await dictionaryLoaders[locale]();
  return dictionaryModule.default;
}

export async function getDictionaryFromParam(locale: string): Promise<Dictionary> {
  assertLocale(locale);
  return getDictionary(locale);
}
