import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioContext } from "@/lib/chatbot/portfolio-context";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot/prompts";
import { resolveResources } from "@/lib/chatbot/resources";
import { identifyLocalIntent, resolveLocalIntent } from "@/lib/chatbot/intent-resolver";
import { resolveResponseLanguage } from "@/lib/chatbot/language";
import { buildGroundedReasoning } from "@/lib/chatbot/grounded-reasoning";
import { buildTrustedResponse } from "@/lib/chatbot/v4-responses";
import { createLocalResponse, type LocalIntent } from "@/lib/chatbot/local-responses";
import { routeSemantically, type SemanticIntent, type SemanticRouterResult } from "@/lib/chatbot/semantic-router";
import { buildCompoundRequestPlan, buildDeterministicFallbackPlan, buildRequestPlan, isCompoundRequest, shouldBuildRequestPlan, type RequestPlan } from "@/lib/chatbot/request-plan";
import { composeRequestPlan, validateComposedResponse } from "@/lib/chatbot/response-composer";
import type { ChatLanguage, ChatResponse } from "@/lib/chatbot/types";
import { validateChatRequest } from "@/lib/chatbot/validation";
import { GROQ_MODEL } from "@/lib/chatbot/model";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const requestLog = new Map<string, number[]>();

const supportedLanguages: ChatLanguage[] = ["en", "fr", "ar", "darija"];
const semanticLocalIntents: Partial<Record<SemanticIntent, LocalIntent>> = {
  GREETING: "GREETING", CV: "CV", GITHUB: "GITHUB", LINKEDIN: "LINKEDIN",
  CONTACT: "CONTACT", PROJECTS: "PROJECTS", CERTIFICATIONS: "CERTIFICATIONS", SKILLS: "SKILLS",
};

function clarificationResponse(language: ChatLanguage): ChatResponse {
  const answers: Record<ChatLanguage, string> = {
    en: "Of course. Which of Issam's projects would you like to know about?",
    fr: "Bien sûr. De quel projet d'Issam souhaitez-vous parler ?",
    ar: "بالتأكيد. عن أي مشروع من مشاريع عصام تريد أن تعرف؟",
    darija: "أكيد. على أنهي projet ديال Issam بغيتي تعرف؟",
  };
  return { answer: answers[language], language, resources: [] };
}

function outOfScopeResponse(language: ChatLanguage): ChatResponse {
  const answers: Record<ChatLanguage, string> = {
    en: "I can only answer questions about Issam using his documented portfolio and CV.",
    fr: "Je peux uniquement répondre aux questions sur Issam à partir de son portfolio et de son CV documentés.",
    ar: "يمكنني الإجابة فقط عن الأسئلة المتعلقة بعصام اعتماداً على ملفه وسيرته الذاتية الموثقين.",
    darija: "نقدر نجاوب غير على الأسئلة على Issam انطلاقاً من الـ portfolio والـ CV الموثقين ديالو.",
  };
  return { answer: answers[language], language, resources: [] };
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(identifier, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(identifier, recent);

  if (requestLog.size > 500) {
    for (const [key, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }
  return false;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

type ErrorKind = "local-limit" | "provider-limit" | "unavailable" | "configuration";

function localizedError(kind: ErrorKind, language: ChatLanguage): string {
  const messages: Record<ErrorKind, Record<ChatLanguage, string>> = {
    "local-limit": {
      en: "You’re sending messages a little too quickly. Please wait a few seconds.",
      fr: "Vous envoyez des messages un peu trop rapidement. Patientez quelques secondes.",
      ar: "أنت ترسل الرسائل بسرعة كبيرة. يرجى الانتظار بضع ثوانٍ.",
      darija: "كتصيفط الميساجات بسرعة شوية. تسنّى غير شي ثواني وعاود جرّب.",
    },
    "provider-limit": {
      en: "The AI service is temporarily busy. Please try again shortly.",
      fr: "Le service IA est temporairement occupé. Réessayez dans quelques instants.",
      ar: "خدمة الذكاء الاصطناعي مشغولة مؤقتاً. يرجى المحاولة بعد قليل.",
      darija: "الـ assistant مشغول شوية دابا. عاود جرّب من بعد لحظات.",
    },
    unavailable: {
      en: "A technical problem is temporarily preventing the AI assistant from answering. Please try your question again shortly. If the problem persists, reload the page and ask your question again.",
      fr: "Un problème technique empêche momentanément l’assistant IA de répondre. Veuillez réessayer votre question dans quelques instants. Si le problème persiste, rechargez la page puis posez votre question à nouveau.",
      ar: "توجد مشكلة تقنية تمنع المساعد الذكي مؤقتاً من الإجابة. يرجى إعادة طرح سؤالك بعد قليل. إذا استمرت المشكلة، فأعد تحميل الصفحة ثم اطرح سؤالك من جديد.",
      darija: "كاين مشكل تقني مانع الـ assistant مؤقتاً من الجواب. عاود جرّب السؤال ديالك من بعد شوية. إلا بقى المشكل، عاود حمّل الصفحة وطرح السؤال من جديد.",
    },
    configuration: {
      en: "The AI assistant is not configured yet.", fr: "L’assistant IA n’est pas encore configuré.",
      ar: "لم تتم تهيئة المساعد الذكي بعد.", darija: "الـ assistant مازال ما تدارش ليه الإعداد.",
    },
  };
  return messages[kind][language];
}

function looksLikeDarija(answer: string): boolean {
  return /[\u0600-\u06ff]/.test(answer) || /\b(?:khoya|chef|khddam|khdam|dyal|3la|7it|wach|kay|f had|mzyan|ghadi)\b/i.test(answer);
}

function parseModelResponse(content: string | null, expectedLanguage: ChatLanguage): {
  answer: string;
  language: ChatLanguage;
  resourceIds: string[];
} | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (
      typeof parsed.answer !== "string" ||
      !parsed.answer.trim() ||
      !supportedLanguages.includes(parsed.language as ChatLanguage) ||
      !Array.isArray(parsed.resourceIds) ||
      parsed.resourceIds.length > 4 ||
      !parsed.resourceIds.every((id) => typeof id === "string") ||
      parsed.language !== expectedLanguage ||
      (expectedLanguage === "darija" && !looksLikeDarija(parsed.answer))
    ) return null;
    return {
      answer: parsed.answer.trim(),
      language: parsed.language as ChatLanguage,
      resourceIds: parsed.resourceIds,
    };
  } catch {
    return null;
  }
}

function getProviderStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object" || !("status" in error)) return undefined;
  return typeof error.status === "number" ? error.status : undefined;
}

export async function POST(request: NextRequest) {
  const identifier =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("The request body must be valid JSON.", 400);
  }

  const validation = validateChatRequest(body);
  if (!validation.ok) {
    return errorResponse(validation.error, 400);
  }

  const language = resolveResponseLanguage(
    validation.data.message,
    validation.data.preferredLanguage,
  );
  // Every configured request is first interpreted by Groq. Deterministic
  // responses remain safe fallbacks when the provider is unavailable.
  let providerRateCounted = false;
  let client: Groq | null = null;
  let semanticPreflight: SemanticRouterResult | null = null;
  if (process.env.GROQ_API_KEY) {
    if (isRateLimited(identifier)) return errorResponse(localizedError("local-limit", language), 429);
    providerRateCounted = true;
    client = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 8_000, maxRetries: 0 });
    try {
      semanticPreflight = await routeSemantically(client, validation.data.message, validation.data.history, validation.data.preferredLanguage);
    } catch (error) {
      console.error("Semantic preflight failed:", error instanceof Error ? error.message : "Unknown error");
    }
  }
  if (validation.data.history.length === 0 && /^(?:parle moi de|tell me about|talk about) (?:son|his) (?:projet|project)$/i.test(validation.data.message.trim())) {
    return NextResponse.json(clarificationResponse(language), { headers: { "x-chat-source": "semantic-clarification" } });
  }
  const localResponse = resolveLocalIntent(
    validation.data.message,
    validation.data.preferredLanguage,
  );
  const requiresRequestPlan = shouldBuildRequestPlan(validation.data.message);
  const compoundRequest = isCompoundRequest(validation.data.message);
  const trustedResponse = buildTrustedResponse(
    validation.data.message,
    language,
    validation.data.history,
  );
  if (/\b(?:donne|give)\b.*\b(?:cv|resume)\b/i.test(validation.data.message)) {
    return NextResponse.json(createLocalResponse("CV", language), {
      headers: { "x-chat-source": "semantic-local", "x-chat-intent": "CV" },
    });
  }
  if (trustedResponse && !requiresRequestPlan) {
    return NextResponse.json({
      answer: trustedResponse.answer,
      language,
      resources: resolveResources(trustedResponse.resourceIds),
    } satisfies ChatResponse);
  }
  if (localResponse && !requiresRequestPlan) {
    const localIntent = identifyLocalIntent(validation.data.message)?.intent ?? "LOCAL";
    return NextResponse.json(localResponse, {
      headers: { "x-chat-source": "local", "x-chat-intent": localIntent },
    });
  }
  if (/^(?:hy|helo|h+y+|bnjr|slm)$/i.test(validation.data.message.trim())) {
    const greetingLanguage = validation.data.preferredLanguage ?? language;
    return NextResponse.json(createLocalResponse("GREETING", greetingLanguage), {
      headers: { "x-chat-source": "semantic-local", "x-chat-intent": "GREETING" },
    });
  }

  if (requiresRequestPlan) {
    if (!providerRateCounted && isRateLimited(identifier)) return errorResponse(localizedError("local-limit", language), 429);
    providerRateCounted = true;
    let semanticPlan: RequestPlan | null = null;
    let plannerLatencyMs = 0;
    if (process.env.GROQ_API_KEY) {
      client = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 8_000, maxRetries: 0 });
      try {
        const planStartedAt = performance.now();
        semanticPlan = await buildRequestPlan(client, validation.data.message, validation.data.history, validation.data.preferredLanguage);
        plannerLatencyMs = Math.round(performance.now() - planStartedAt);
        if (semanticPlan?.clarificationNeeded) {
          console.info("Chat latency", { plannerLatencyMs: Math.round(performance.now() - planStartedAt), generationLatencyMs: 0, route: "plan-clarification" });
          return NextResponse.json(clarificationResponse(semanticPlan.language), { headers: { "x-chat-source": "plan-clarification" } });
        }
      } catch (error) {
        console.error("Semantic planner failed:", error instanceof Error ? error.message : "Unknown error");
      }
    }
    const fallbackPlan = compoundRequest ? null : buildDeterministicFallbackPlan(validation.data.message, language);
    const compoundPlan = compoundRequest && (semanticPreflight || semanticPlan)
      ? buildCompoundRequestPlan(validation.data.message, language)
      : null;
    console.info("Request plan summary", {
      compoundRequest,
      groqRouterSucceeded: Boolean(semanticPreflight),
      groqPlannerSucceeded: Boolean(semanticPlan),
      semanticSubRequests: semanticPlan?.subRequests.map(({ intent, domain, scope }) => ({ intent, domain, scope })) ?? [],
      compoundAspects: compoundPlan?.requiredAspects ?? [],
    });
    for (const [plan, strategy] of [[compoundPlan, "compound-covered"], [semanticPlan, "semantic"], [fallbackPlan, "deterministic-fallback"]] as const) {
      if (!plan) continue;
      const composed = composeRequestPlan(plan);
      if (composed && validateComposedResponse(plan, composed)) {
        console.info("Chat latency", { plannerLatencyMs, generationLatencyMs: 0, route: "plan-composed", strategy, subRequests: plan.subRequests.length });
        return NextResponse.json({ answer: composed.answer, language: plan.language, resources: resolveResources(composed.resourceIds) } satisfies ChatResponse, {
          headers: { "x-chat-source": "plan-composed", "x-chat-plan-strategy": strategy, "x-chat-subrequests": String(plan.subRequests.length) },
        });
      }
    }
    console.warn("Request plan could not be safely composed.");
    if (compoundRequest) {
      return errorResponse(localizedError("unavailable", language), 503);
    }
  }

  if (trustedResponse) {
    return NextResponse.json({
      answer: trustedResponse.answer,
      language,
      resources: resolveResources(trustedResponse.resourceIds),
    } satisfies ChatResponse, requiresRequestPlan ? {
      headers: { "x-chat-source": "plan-composed", "x-chat-plan-strategy": "trusted-fallback" },
    } : undefined);
  }
  const groundedReasoning = buildGroundedReasoning(validation.data.message, language);
  if (!providerRateCounted && isRateLimited(identifier)) {
    return errorResponse(localizedError("local-limit", language), 429);
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("Chat API configuration error: GROQ_API_KEY is missing.");
    return errorResponse(localizedError("configuration", language), 503);
  }

  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 8_000, maxRetries: 0 });
  const totalStartedAt = performance.now();
  const routerStartedAt = performance.now();
  let semanticRoute: SemanticRouterResult | null = semanticPreflight;
  if (!semanticRoute) try {
    semanticRoute = await routeSemantically(client, validation.data.message, validation.data.history, validation.data.preferredLanguage);
  } catch (error) {
    console.error("Semantic router failed:", error instanceof Error ? error.message : "Unknown error");
    semanticRoute = null;
  }
  const routerLatencyMs = Math.round(performance.now() - routerStartedAt);

  const logLatency = (route: string, generationLatencyMs = 0) => console.info("Chat latency", {
    routerLatencyMs,
    generationLatencyMs,
    totalLatencyMs: Math.round(performance.now() - totalStartedAt),
    route,
  });

  if (!semanticRoute || semanticRoute.confidence < 0.6) {
    if (groundedReasoning) {
      logLatency("router-grounded-fallback");
      return NextResponse.json({
        answer: groundedReasoning.answer,
        language,
        resources: resolveResources(groundedReasoning.resourceIds),
      } satisfies ChatResponse, { headers: { "x-chat-source": "grounded-fallback" } });
    }
    // Preserve the pre-V4.2 safe behavior: if classification failed but no
    // deterministic answer exists, attempt the normal grounded generator.
    semanticRoute = {
      language,
      intent: "PORTFOLIO_QUESTION",
      confidence: 1,
      domain: "general",
      entityType: null,
      entityName: null,
      sourceScope: "both",
      responseType: "direct",
      followUpUseful: false,
      route: "REASONING",
      clarificationReason: null,
    };
  }

  // A high-confidence deterministic reasoning match is also a validator: the
  // semantic router may not downgrade it to an unrelated simple local intent.
  if (groundedReasoning && semanticRoute.route === "LOCAL") {
    semanticRoute = {
      ...semanticRoute,
      intent: "RECRUITER_REASONING",
      route: "REASONING",
      clarificationReason: null,
    };
  }

  const responseLanguage = groundedReasoning ? language : semanticRoute.intent === "GREETING"
    ? resolveResponseLanguage(validation.data.message, validation.data.preferredLanguage ?? semanticRoute.language)
    : semanticRoute.language;
  const mappedLocalIntent = semanticLocalIntents[semanticRoute.intent];
  if (semanticRoute.route === "LOCAL" && mappedLocalIntent) {
    logLatency("semantic-local");
    return NextResponse.json(createLocalResponse(mappedLocalIntent, responseLanguage), {
      headers: { "x-chat-source": "semantic-local", "x-chat-intent": semanticRoute.intent },
    });
  }
  if (semanticRoute.route === "LOCAL" && semanticRoute.intent === "OUT_OF_SCOPE") {
    logLatency("out-of-scope");
    return NextResponse.json(outOfScopeResponse(responseLanguage), {
      headers: { "x-chat-source": "semantic-local", "x-chat-intent": semanticRoute.intent },
    });
  }
  if (semanticRoute.route === "CLARIFICATION") {
    logLatency("clarification");
    return NextResponse.json(clarificationResponse(responseLanguage), {
      headers: { "x-chat-source": "semantic-clarification", "x-chat-intent": semanticRoute.intent },
    });
  }
  if (semanticRoute.intent === "ENTITY_DETAIL" && semanticRoute.entityName) {
    const entityResponse = buildTrustedResponse(semanticRoute.entityName, responseLanguage, validation.data.history);
    if (entityResponse) {
      logLatency("semantic-entity");
      return NextResponse.json({
        answer: entityResponse.answer,
        language: responseLanguage,
        resources: resolveResources(entityResponse.resourceIds),
      } satisfies ChatResponse, { headers: { "x-chat-source": "semantic-local", "x-chat-intent": semanticRoute.intent } });
    }
  }

  const generationClient = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 15_000, maxRetries: 0 });
  const context = buildPortfolioContext(validation.data.message);
  const conversation = validation.data.history.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  const messages = [
    {
      role: "system" as const,
      content: `${CHATBOT_SYSTEM_PROMPT}\n\nPORTFOLIO_CONTEXT:\n${JSON.stringify(context)}`,
    },
    ...conversation,
    {
      role: "user" as const,
      content: `${validation.data.message}\n\nMANDATORY RESPONSE INSTRUCTIONS:\n- Write the answer naturally in ${responseLanguage}${responseLanguage === "darija" ? " (Moroccan Darija matching the user's Arabizi/mixed style, never French or Modern Standard Arabic)" : ""}.\n- Start with the direct conclusion.\n- If this asks why, for the best items, relevance, candidacy, or a comparison, follow the conclusion with 2–4 concise evidence-based reasons from PORTFOLIO_CONTEXT.\n- Do not merely list names when a justification or comparison was requested.`,
    },
  ];

  try {
    const generationStartedAt = performance.now();
    const createCompletion = (retry = false) => generationClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: retry
        ? [...messages, {
            role: "system" as const,
            content: `Your previous output was invalid. Return exactly one valid JSON object matching the required keys and types, with no markdown. The answer itself must be written naturally in ${responseLanguage}${responseLanguage === "darija" ? ", using Moroccan Darija rather than French or Modern Standard Arabic" : ""}. Fully answer any requested comparison, selection, or why question.`,
          }]
        : messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 600,
    });

    let completion = await createCompletion();
    let parsed = parseModelResponse(completion.choices[0]?.message.content ?? null, responseLanguage);
    if (!parsed) {
      completion = await createCompletion(true);
      parsed = parseModelResponse(completion.choices[0]?.message.content ?? null, responseLanguage);
    }
    if (!parsed) {
      throw new Error("The model returned an invalid structured response.");
    }

    const generationLatencyMs = Math.round(performance.now() - generationStartedAt);
    if (groundedReasoning) {
      parsed.answer = groundedReasoning.answer;
      parsed.resourceIds = groundedReasoning.resourceIds;
    }
    const result: ChatResponse = { answer: parsed.answer, language: parsed.language, resources: resolveResources(parsed.resourceIds) };
    logLatency(groundedReasoning ? "grounded-generation" : "generation", generationLatencyMs);
    return NextResponse.json(result, { headers: { "x-chat-source": groundedReasoning ? "grounded-generation" : "generation", "x-chat-intent": semanticRoute.intent } });
  } catch (error) {
    const providerStatus = getProviderStatus(error);
    console.error(
      "Groq chat request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    if (groundedReasoning) {
      logLatency("grounded-generation-fallback");
      return NextResponse.json({
        answer: groundedReasoning.answer,
        language: responseLanguage,
        resources: resolveResources(groundedReasoning.resourceIds),
      } satisfies ChatResponse, { headers: { "x-chat-source": "grounded-fallback", "x-chat-intent": semanticRoute.intent } });
    }
    if (providerStatus === 429) {
      return errorResponse(localizedError("provider-limit", responseLanguage), 503);
    }
    if (providerStatus === 404 || providerStatus === 422) {
      return errorResponse(localizedError("unavailable", responseLanguage), 503);
    }
    return errorResponse(
      localizedError("unavailable", responseLanguage),
      502,
    );
  }
}
