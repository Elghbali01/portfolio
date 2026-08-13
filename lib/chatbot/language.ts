import type { ChatLanguage } from "./types";

const ARABIC_SCRIPT = /[\u0600-\u06ff]/;
const ARABIC_DARIJA = /(?:شنو|واش|ديال|بغيت|عطيني|هضر|معايا|بالدارجة|كيف داير|كيعرف|خدام)/;
const ARABIZI_DARIJA = /\b(?:salam|slm|labas|kidayr|chno|wach|dyal|dyalo|3tini|hder|m3aya|darija|kay3ref|fin 9ra)\b/i;
const FRENCH = /\b(?:bonjour|bonsoir|salut|projets?|comp[eé]tences?|certif(?:icat)?s?|voir|donne(?:r)?|quels?|parle|fran[cç]ais)\b/i;

export function normalizeMessage(message: string): string {
  return message
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectMessageLanguage(message: string): ChatLanguage {
  const normalized = normalizeMessage(message);
  if (ARABIZI_DARIJA.test(normalized)) return "darija";
  if (ARABIC_SCRIPT.test(normalized)) {
    return ARABIC_DARIJA.test(normalized) ? "darija" : "ar";
  }
  if (FRENCH.test(normalized)) return "fr";
  return "en";
}

export function detectLanguageSwitch(message: string): ChatLanguage | null {
  const normalized = normalizeMessage(message);
  if (
    /(?:hder|hdr) m3aya (?:b |bel )?darija|بالدارجة|ب الدارجة|بالدريجة/.test(normalized)
  ) return "darija";
  if (/parle (?:avec moi )?(?:en |le )?fran[cç]ais/.test(normalized)) return "fr";
  if (/speak (?:to me )?in english/.test(normalized)) return "en";
  if (/تكلم (?:معي )?بالعربية|تحدث (?:معي )?بالعربية/.test(normalized)) return "ar";
  return null;
}

export function resolveResponseLanguage(
  message: string,
  preferredLanguage?: ChatLanguage,
): ChatLanguage {
  return detectLanguageSwitch(message) ?? preferredLanguage ?? detectMessageLanguage(message);
}
