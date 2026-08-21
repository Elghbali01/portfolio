import type Groq from "groq-sdk";
import type { ChatHistoryMessage, ChatLanguage } from "./types";
import { GROQ_MODEL } from "./model";

export const semanticIntents = [
  "GREETING", "CV", "GITHUB", "LINKEDIN", "CONTACT", "PROJECTS",
  "CERTIFICATIONS", "SKILLS", "ENTITY_DETAIL", "EDUCATION", "EXPERIENCE",
  "RECRUITER_REASONING", "PORTFOLIO_QUESTION", "OUT_OF_SCOPE", "UNKNOWN",
] as const;

export type SemanticIntent = (typeof semanticIntents)[number];
export type SemanticRoute = "LOCAL" | "REASONING" | "CLARIFICATION";
export type SemanticDomain = "backend" | "data_science" | "ai" | "education" | "certification" | "general";
export type SemanticEntityType = "project" | "certification" | "technology" | "education" | "cv";
export type SemanticSourceScope = "portfolio" | "cv" | "both";
export type SemanticResponseType = "direct" | "summary" | "list" | "detail" | "resource";

export interface SemanticRouterResult {
  language: ChatLanguage;
  intent: SemanticIntent;
  confidence: number;
  domain: SemanticDomain | null;
  entityType: SemanticEntityType | null;
  entityName: string | null;
  sourceScope: SemanticSourceScope;
  responseType: SemanticResponseType;
  followUpUseful: boolean;
  route: SemanticRoute;
  clarificationReason: string | null;
}

const languages: ChatLanguage[] = ["en", "fr", "ar", "darija"];
const routes: SemanticRoute[] = ["LOCAL", "REASONING", "CLARIFICATION"];
const domains: SemanticDomain[] = ["backend", "data_science", "ai", "education", "certification", "general"];
const entityTypes: SemanticEntityType[] = ["project", "certification", "technology", "education", "cv"];
const sourceScopes: SemanticSourceScope[] = ["portfolio", "cv", "both"];
const responseTypes: SemanticResponseType[] = ["direct", "summary", "list", "detail", "resource"];

const ROUTER_PROMPT = `You are a tiny semantic router for Issam's portfolio assistant. Classify language and intent; do not answer the user and do not validate claims about Issam.
Return exactly one JSON object with all keys, following this shape (choose one allowed value, never copy a pipe-separated list):
{"language":"en","intent":"UNKNOWN","confidence":0.0,"domain":null,"entityType":null,"entityName":null,"sourceScope":"both","responseType":"direct","followUpUseful":false,"route":"REASONING","clarificationReason":null}
Allowed language values: en, fr, ar, darija.
Allowed intent values: GREETING, CV, GITHUB, LINKEDIN, CONTACT, PROJECTS, CERTIFICATIONS, SKILLS, ENTITY_DETAIL, EDUCATION, EXPERIENCE, RECRUITER_REASONING, PORTFOLIO_QUESTION, OUT_OF_SCOPE, UNKNOWN.
Allowed domain values: backend, data_science, ai, education, certification, general, or JSON null.
Allowed entityType values: project, certification, technology, education, cv, or JSON null.
Allowed route values: LOCAL, REASONING, CLARIFICATION.
Rules:
- Infer the likely meaning of short misspelled social messages and abbreviations semantically; do not require exact spelling.
- Infer the intended response language as part of that correction. Do not default Latin-script typos to English: distinguish likely French, English, and Arabizi/Darija from their linguistic form.
- GREETING/CV/GITHUB/LINKEDIN/CONTACT/simple lists are LOCAL.
- Comparisons, why, ranking, recruiter assessment, synthesis and evidence selection are REASONING.
- A singular unnamed ambiguous entity such as "tell me about his project" is CLARIFICATION; do not clarify clear greetings, CV requests, lists, or named entities.
- A named project/certificate is ENTITY_DETAIL. Out-of-portfolio questions are OUT_OF_SCOPE and LOCAL.
- Preserve explicit source constraints: use sourceScope=cv for questions about facts in the CV, portfolio for an explicit portfolio-only request, otherwise both. Asking about CV content is not a CV resource-display request.
- responseType=resource only when the user asks to show/open/download a resource. Use summary for a profile presentation, list for collections, detail for an entity explanation, and direct otherwise.
- followUpUseful is true for broad profile summaries, broad skill lists, or project explanations where a natural next choice helps; false for simple factual answers such as email, age, or languages.
- Conversation history only resolves references or a reply to a clarification. It is never factual evidence.
- clarificationReason is a short neutral reason only for CLARIFICATION; otherwise null.
- Output JSON only.`;

function parseRouterResponse(content: string | null): SemanticRouterResult | null {
  if (!content) return null;
  try {
    const value = JSON.parse(content) as Record<string, unknown>;
    const keys = ["language", "intent", "confidence", "domain", "entityType", "entityName", "sourceScope", "responseType", "followUpUseful", "route", "clarificationReason"];
    if (Object.keys(value).length !== keys.length || !keys.every((key) => key in value)) return null;
    if (!languages.includes(value.language as ChatLanguage)) return null;
    if (!semanticIntents.includes(value.intent as SemanticIntent)) return null;
    if (typeof value.confidence !== "number" || value.confidence < 0 || value.confidence > 1) return null;
    if (value.domain !== null && !domains.includes(value.domain as SemanticDomain)) return null;
    if (value.entityType !== null && !entityTypes.includes(value.entityType as SemanticEntityType)) return null;
    if (value.entityName !== null && typeof value.entityName !== "string") return null;
    if (!sourceScopes.includes(value.sourceScope as SemanticSourceScope)) return null;
    if (!responseTypes.includes(value.responseType as SemanticResponseType)) return null;
    if (typeof value.followUpUseful !== "boolean") return null;
    if (!routes.includes(value.route as SemanticRoute)) return null;
    if (value.clarificationReason !== null && typeof value.clarificationReason !== "string") return null;
    if (value.route === "CLARIFICATION" && !value.clarificationReason) return null;
    if (value.route !== "CLARIFICATION" && value.clarificationReason !== null) return null;
    return value as unknown as SemanticRouterResult;
  } catch {
    return null;
  }
}

function minimalHistory(history: ChatHistoryMessage[]): string {
  return history.slice(-2).map(({ role, content }) =>
    `${role.toUpperCase()}: ${content.slice(0, 300)}`,
  ).join("\n");
}

export async function routeSemantically(
  client: Groq,
  message: string,
  history: ChatHistoryMessage[],
  preferredLanguage?: ChatLanguage,
): Promise<SemanticRouterResult | null> {
  const historyText = minimalHistory(history);
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: ROUTER_PROMPT },
      { role: "user", content: `${preferredLanguage ? `UI_LANGUAGE_HINT: ${preferredLanguage} (use only as a tie-breaker)\n` : ""}${historyText ? `CONVERSATION:\n${historyText}\n\n` : ""}LATEST_MESSAGE:\n${message}` },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
    max_tokens: 650,
  });
  const content = completion.choices[0]?.message.content ?? null;
  const parsed = parseRouterResponse(content);
  if (!parsed) console.warn("Semantic router returned an invalid JSON shape.");
  return parsed;
}
