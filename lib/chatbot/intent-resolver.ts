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
  if (/^(?:cv|resume|résumé)$/.test(text) || /(?:montre|affiche|ouvre|show|open|display|عطيني|وريني).*\b(?:cv|resume)\b|(?:cv|resume).*\b(?:issam|عصام)\b.*(?:stp|please)?$/.test(text)) return { intent: "CV" };
  if (matchesOnly(text, /\bgithub\b/)) return { intent: "GITHUB" };
  if (matchesOnly(text, /\blinkedin\b/)) return { intent: "LINKEDIN" };
  if (/\b(?:num[eé]ro|t[eé]l[eé]phone|phone|mobile|tel)\b|رقم الهاتف|النمرة/.test(text)) return { intent: "PHONE" };
  if (/\b(?:email|e mail|courriel|mail)\b|البريد الإلكتروني/.test(text)) return { intent: "EMAIL" };
  if (/\b(?:localisation|location|ville|city)\b|(?:^|\s)où (?:habite|se trouve)|أين|فين ساكن/.test(text)) return { intent: "LOCATION" };
  if (/\b(?:langues?|languages?)\b|اللغات|لغات/.test(text) && !/\b(?:cv|resume)\b|السيرة الذاتية/.test(text)) return { intent: "LANGUAGES" };
  if (/(?:chercher|rechercher|search|look up).*(?:ailleurs|internet|web|outside|other sources)|(?:ailleurs|internet|web|outside).*(?:portfolio|cv|resume)|مصادر خارجية|الإنترنت/.test(text)) return { intent: "SOURCE_POLICY" };
  if (matchesOnly(text, /\b(?:contact|contacter)\b|تواصل/)) return { intent: "CONTACT" };
  if (/\b(?:bac|bachelor|baccalaur[eé]at|baccalaureate)\b|الباك|البكالوريا/.test(text)) return { intent: "BACCALAUREATE" };
  if (REASONING_REQUEST.test(text)) return null;
  if (/\b(?:son|his) (?:projet|project)\b/.test(text) && !/\b(?:projets|projects)\b/.test(text)) return null;
  const sourceQuestion = /\b(?:dans|du|sur|from|in|mentioned|indiqu|كاين|ف)\b.*\b(?:cv|resume)\b|\b(?:cv|resume)\b.*\b(?:projet|project|langue|language|skill|comp[eé]tence|certif)/.test(text);
  const targetedDomain = /data science|machine learning|\bml\b|backend|java|spring|علم البيانات|التعلم الآلي/.test(text);
  if (/\b(?:certifications?|certificats?|certifs?|certif)\b|الشهادات|شهادات/.test(text) && !sourceQuestion && !targetedDomain) {
    return { intent: "CERTIFICATIONS", detailed: /\b(?:description|detail|détails?|tous|toutes|all)\b/.test(text) };
  }
  if (/\b(?:projects?|projets?)\b|المشاريع|مشاريع/.test(text) && !sourceQuestion) {
    return { intent: "PROJECTS", all: /\b(?:all|tous|toutes)\b/.test(text) };
  }
  if (/\b(?:skills?|comp[eé]tences?)\b|المهارات|مهارات|كيعرف يدير/.test(text) && !sourceQuestion && !targetedDomain) {
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
