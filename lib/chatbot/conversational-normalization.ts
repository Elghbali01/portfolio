import type { ChatLanguage } from "./types";

export interface GreetingMatch {
  canonical: string;
  language: ChatLanguage;
}

const MAX_GREETING_LENGTH = 40;

/**
 * Aggressive repetition cleanup is deliberately restricted to short greeting
 * detection. The original message remains untouched for entities and Groq.
 */
export function normalizeConversationalMessage(message: string): string {
  const compact = message
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!compact || compact.length > MAX_GREETING_LENGTH) return compact;

  return compact
    .replace(/([a-z])\1{2,}/g, "$1")
    .replace(/\b(?:salaam|salam)\b/g, "salam")
    .replace(/\b(?:hii|hi)\b/g, "hi");
}

const greetingAliases: Array<{ pattern: RegExp; canonical: string; language: ChatLanguage }> = [
  { pattern: /^(?:bonjour|bjr|bjour|salut|slt|bonsoir|bsr|coucou)$/, canonical: "bonjour", language: "fr" },
  { pattern: /^(?:hello|hi|hey|yo)$/, canonical: "hello", language: "en" },
  { pattern: /^(?:salam|salam (?:alikoum|3likom)|labas|kidayr|ki dayr)$/, canonical: "salam", language: "darija" },
  { pattern: /^(?:سلام|السلام عليكم|مرحبا|أهلا)$/, canonical: "مرحبا", language: "ar" },
];

export function detectGreeting(message: string): GreetingMatch | null {
  const normalized = normalizeConversationalMessage(message);
  if (!normalized || normalized.length > MAX_GREETING_LENGTH) return null;
  const match = greetingAliases.find(({ pattern }) => pattern.test(normalized));
  return match ? { canonical: match.canonical, language: match.language } : null;
}
