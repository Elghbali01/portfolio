import { normalizeMessage } from "./language";
import type { ChatLanguage } from "./types";

export type AnswerMode = "normal" | "short" | "yes-no" | "list";

export interface ResponseConstraints {
  exactCount?: number;
  maxCount?: number;
  answerMode: AnswerMode;
  explanation: "required" | "forbidden" | "optional";
  separateItems: boolean;
  conclusionFirst: boolean;
  selectionRequired: boolean;
  comparisonRequired: boolean;
  multilingualOrder: ChatLanguage[];
}

export interface QueryAnalysis {
  normalized: string;
  constraints: ResponseConstraints;
  isFollowUp: boolean;
  hasUserAssertedMetric: boolean;
  domains: Array<"backend" | "data-science">;
}

const numberWords: Record<string, number> = {
  one: 1, un: 1, une: 1, two: 2, deux: 2, three: 3, trois: 3,
  four: 4, quatre: 4, five: 5, cinq: 5,
};

function requestedCount(text: string, kind: "exact" | "max"): number | undefined {
  const prefix = kind === "exact"
    ? "(?:exactly|exactement|exact|juste|only|uniquement|أقوى|افضل|أفضل)"
    : "(?:maximum|max|au plus|at most)";
  const match = text.match(new RegExp(`${prefix}\\s+(?:les\\s+)?(\\d+|one|un|une|two|deux|three|trois|four|quatre|five|cinq)`));
  if (!match) return undefined;
  return /^\d+$/.test(match[1]) ? Number(match[1]) : numberWords[match[1]];
}

export function analyzeQuery(message: string): QueryAnalysis {
  const normalized = normalizeMessage(message);
  const yesNo = /(?:uniquement|seulement|only)\s+(?:par\s+)?(?:oui ou non|oui\/non|yes or no|yes\/no)/.test(normalized);
  const explanationForbidden = /sans (?:rien )?(?:expliquer|explication)|without explanation|juste|uniquement (?:le|la|les|l information)/.test(normalized);
  const explanationRequired = /pourquoi|why|explique|explain|justifie|justify|اشرح|3lach/.test(normalized);
  const exactCount = requestedCount(normalized, "exact")
    ?? (/\b(?:les )?(?:trois|three|3) (?:meilleures?|best|preuves?|evidence)/.test(normalized) ? 3 : undefined);

  return {
    normalized,
    constraints: {
      exactCount,
      maxCount: requestedCount(normalized, "max"),
      answerMode: yesNo ? "yes-no" : /\b(?:liste|list)\b/.test(normalized) ? "list" : /courte|short/.test(normalized) ? "short" : "normal",
      explanation: explanationForbidden ? "forbidden" : explanationRequired ? "required" : "optional",
      separateItems: /chacun(?:e)? séparément|each separately|بشكل منفصل/.test(normalized),
      conclusionFirst: /première phrase|first sentence|d abord|first/.test(normalized),
      selectionRequired: /choisis|choose|best|meilleur|plus fort|strongest|أقوى|افضل|أفضل/.test(normalized),
      comparisonRequired: /compar|backend ou data science|backend or data science/.test(normalized),
      multilingualOrder: /français puis (?:en )?anglais|french then english/.test(normalized) ? ["fr", "en"] : [],
    },
    isFollowUp: /ces (?:trois|3)|these (?:three|3)|parmi (?:eux|elles|ces)|among them|laquelle est la plus forte|which (?:one )?is (?:the )?strongest/.test(normalized),
    hasUserAssertedMetric: /\b\d+(?:[.,]\d+)?\s*%/.test(message),
    domains: [
      ...(normalized.includes("backend") || /java|spring/.test(normalized) ? ["backend" as const] : []),
      ...(normalized.includes("data science") || normalized.includes("data scientist") || normalized.includes("علم البيانات") ? ["data-science" as const] : []),
    ],
  };
}
