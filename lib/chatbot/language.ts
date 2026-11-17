import type { ChatLanguage } from "./types";

const ARABIC_SCRIPT = /[\u0600-\u06ff]/;
const ARABIC_DARIJA = /(?:شنو|واش(?:\s|$)|ديال|بغيت|عطيني|هضر|معايا|بالدارجة|كيف داير|كيعرف|خدام)/;
const ARABIZI_DARIJA = /\b(?:salam|slm|labas|kidayr|3lach|chno|wach|huma|aham|dyal|dyalo|dial|bghit|n3ref|aktar|3tini|hder|m3aya|darija|kay3ref|khdam|khdem|y9der|fin|9ra|had|ki dayr)\b/i;
const FRENCH = /\b(?:bonjour|bonsoir|salut|pourquoi|comment|qui|pr[eé]sente|r[eé]sume|ann[eé]e|obtenu|profil|poste|serait|adapt[eé]|int[eé]ressant|projets?|comp[eé]tences?|certif(?:icat)?s?|voir|montre|affiche|ouvre|donne(?:r)?|quel(?:le)?s?|parle|num[eé]ro|t[eé]l[eé]phone|courriel|localisation|adresse|peux|chercher|ailleurs|fran[cç]ais|d'apr[eè]s|souhaitez|r[eé]ponds?|document[eé]e?)\b/i;
const ENGLISH = /\b(?:hello|hi|hey|what|which|why|show|tell|does|between|skills?|projects?|certifications?|candidate|stronger|relevant|experience|education)\b/i;
const FRENCH_RESPONSE_MARKERS = /\b(?:le|la|les|des|du|de|est|sont|avec|dans|pour|ce|cette|son|ses|une|un|et|mais|qui|par|sur|il|elle|aussi|grâce|grace|projet|compétence|documenté|documentée|je|vous|votre|notre|nous|peux|peut|souhaitez|d'apr[eè]s)\b/i;
const ENGLISH_RESPONSE_MARKERS = /\b(?:what|which|why|show|tell|does|do|has|have|is|are|his|her|their|the|with|for|from|about|where|when|who|can|could|would|did|this|that|these|those|please|how)\b/i;

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

export function isLikelyResponseLanguage(message: string, expected: ChatLanguage): boolean {
  const normalized = normalizeMessage(message);
  const hasArabicScript = ARABIC_SCRIPT.test(message);
  const hasDarijaMarker = ARABIC_DARIJA.test(message) || ARABIZI_DARIJA.test(normalized);
  const hasFrenchMarker = FRENCH_RESPONSE_MARKERS.test(normalized) || /[àâçéèêëîïôûùüÿœ]/i.test(message);

  if (expected === "ar") return hasArabicScript && !hasDarijaMarker;
  if (expected === "darija") return hasDarijaMarker;
  if (hasArabicScript || hasDarijaMarker) return false;
  if (expected === "fr") return hasFrenchMarker;
  return !hasFrenchMarker;
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
  preservePreference = false,
): ChatLanguage {
  const explicitSwitch = detectLanguageSwitch(message);
  if (explicitSwitch) return explicitSwitch;
  const normalized = normalizeMessage(message);
  if (ARABIZI_DARIJA.test(normalized)) return "darija";
  if (ARABIC_SCRIPT.test(message)) return ARABIC_DARIJA.test(message) ? "darija" : "ar";
  const strongFrench = FRENCH_RESPONSE_MARKERS.test(normalized) || /[àâçéèêëîïôûùüÿœ]/i.test(message);
  const strongEnglish = ENGLISH_RESPONSE_MARKERS.test(normalized);
  if (strongFrench && !strongEnglish) return "fr";
  if (strongEnglish && !strongFrench) return "en";
  if (preservePreference && preferredLanguage) return preferredLanguage;
  if (strongFrench || FRENCH.test(normalized)) return "fr";
  if (strongEnglish || ENGLISH.test(normalized)) return "en";
  return preferredLanguage ?? "en";
}
