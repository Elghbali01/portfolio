import { detectLanguageSwitch, normalizeMessage, resolveResponseLanguage } from "./language";
import { createLocalResponse, type LocalIntent } from "./local-responses";
import type { ChatLanguage, ChatResponse } from "./types";
import { detectGreeting } from "./conversational-normalization";

interface IntentMatch { intent: LocalIntent; all?: boolean; detailed?: boolean }

const REASONING_REQUEST = /\b(?:why|pourquoi|3lach|best|meilleur|mieux|most relevant|pertinent|strongest|stronger|compare|comparison|between|candidate|candidat|recruiter|recruteur|poste|role|which)\b|لماذا|الأكثر صلة|أفضل|أقوى/;

function matchesOnly(message: string, pattern: RegExp): boolean {
  return message.length <= 90 && pattern.test(message);
}

export function identifyLocalIntent(message: string): IntentMatch | null {
  const text = normalizeMessage(message);
  if (detectLanguageSwitch(text)) return { intent: "LANGUAGE_SWITCH" };
  if (detectGreeting(message)) return { intent: "GREETING" };
  if (/^(?:cv|resume|résumé)$/.test(text)) return { intent: "CV" };
  if (matchesOnly(text, /\bgithub\b/)) return { intent: "GITHUB" };
  if (matchesOnly(text, /\blinkedin\b/)) return { intent: "LINKEDIN" };
  if (matchesOnly(text, /\b(?:contact|email|e mail|contacter)\b|تواصل/)) return { intent: "CONTACT" };
  if (/\b(?:bac|baccalaur[eé]at|baccalaureate)\b|الباك|البكالوريا/.test(text)) return { intent: "BACCALAUREATE" };
  if (REASONING_REQUEST.test(text)) return null;
  if (/\b(?:son|his) (?:projet|project)\b/.test(text) && !/\b(?:projets|projects)\b/.test(text)) return null;
  if (/\b(?:certifications?|certificats?|certifs?|certif)\b|الشهادات|شهادات/.test(text)) {
    return { intent: "CERTIFICATIONS", detailed: /\b(?:description|detail|détails?|tous|toutes|all)\b/.test(text) };
  }
  if (/\b(?:projects?|projets?)\b|المشاريع|مشاريع/.test(text)) {
    return { intent: "PROJECTS", all: /\b(?:all|tous|toutes)\b/.test(text) };
  }
  if (/\b(?:skills?|comp[eé]tences?)\b|المهارات|مهارات|كيعرف يدير/.test(text)) {
    return { intent: "SKILLS", all: /\b(?:all|tous|toutes)\b|كل المهارات/.test(text) };
  }
  return null;
}

export function resolveLocalIntent(
  message: string,
  preferredLanguage?: ChatLanguage,
): ChatResponse | null {
  const match = identifyLocalIntent(message);
  if (!match) return null;
  const language = match.intent === "GREETING"
    ? detectGreeting(message)?.language ?? resolveResponseLanguage(message, preferredLanguage)
    : resolveResponseLanguage(message, preferredLanguage);
  return createLocalResponse(match.intent, language, match);
}
