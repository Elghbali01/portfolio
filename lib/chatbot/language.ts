import type { ChatLanguage } from "./types";

const ARABIC_SCRIPT = /[\u0600-\u06ff]/;
const ARABIC_DARIJA = /(?:شنو|واش(?:\s|$)|ديال|بغيت|عطيني|هضر|معايا|بالدارجة|كيف داير|كيعرف|خدام)/;
const ARABIZI_DARIJA = /\b(?:salam|slm|labas|kidayr|3lach|chno|wach|huma|aham|dyal|dyalo|3tini|hder|m3aya|darija|kay3ref|y9der|fin|9ra|had|ki dayr)\b/i;
const FRENCH = /\b(?:bonjour|bonsoir|salut|pourquoi|comment|ann[eé]e|obtenu|profil|poste|serait|int[eé]ressant|projets?|comp[eé]tences?|certif(?:icat)?s?|voir|donne(?:r)?|quel(?:le)?s?|parle|fran[cç]ais)\b/i;
const ENGLISH = /\b(?:hello|hi|hey|what|which|why|show|tell|does|between|skills?|projects?|certifications?|candidate|stronger|relevant|experience|education)\b/i;

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
  const explicitSwitch = detectLanguageSwitch(message);
  if (explicitSwitch) return explicitSwitch;
  const detected = detectMessageLanguage(message);
  if (detected === "darija" || detected === "ar") return detected;
  const normalized = normalizeMessage(message);
  if (FRENCH.test(normalized)) return "fr";
  if (ENGLISH.test(normalized)) return "en";
  return preferredLanguage ?? detected;
}
