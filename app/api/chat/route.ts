import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioContext } from "@/lib/chatbot/portfolio-context";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot/prompts";
import { resolveResources } from "@/lib/chatbot/resources";
import { resolveLocalIntent } from "@/lib/chatbot/intent-resolver";
import { resolveResponseLanguage } from "@/lib/chatbot/language";
import type { ChatLanguage, ChatResponse } from "@/lib/chatbot/types";
import { validateChatRequest } from "@/lib/chatbot/validation";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestLog = new Map<string, number[]>();

const GROQ_MODEL = "llama-3.1-8b-instant";
const supportedLanguages: ChatLanguage[] = ["en", "fr", "ar", "darija"];

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
      en: "The AI assistant is temporarily unavailable. Please try again shortly.",
      fr: "L’assistant IA est temporairement indisponible. Réessayez dans quelques instants.",
      ar: "المساعد الذكي غير متاح مؤقتاً. يرجى المحاولة بعد قليل.",
      darija: "الـ assistant ما خدامش مؤقتاً. عاود جرّب من بعد لحظات.",
    },
    configuration: {
      en: "The AI assistant is not configured yet.", fr: "L’assistant IA n’est pas encore configuré.",
      ar: "لم تتم تهيئة المساعد الذكي بعد.", darija: "الـ assistant مازال ما تدارش ليه الإعداد.",
    },
  };
  return messages[kind][language];
}

function parseModelResponse(content: string | null): {
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
      !parsed.resourceIds.every((id) => typeof id === "string")
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
  const localResponse = resolveLocalIntent(
    validation.data.message,
    validation.data.preferredLanguage,
  );
  if (localResponse) return NextResponse.json(localResponse);

  if (isRateLimited(identifier)) {
    return errorResponse(localizedError("local-limit", language), 429);
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("Chat API configuration error: GROQ_API_KEY is missing.");
    return errorResponse(localizedError("configuration", language), 503);
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
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
    { role: "user" as const, content: validation.data.message },
  ];

  try {
    const createCompletion = (retry = false) => client.chat.completions.create({
      model: GROQ_MODEL,
      messages: retry
        ? [...messages, {
            role: "system" as const,
            content: "Your previous output was invalid. Return exactly one valid JSON object matching the required keys and types, with no markdown.",
          }]
        : messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 450,
    });

    let completion = await createCompletion();
    let parsed = parseModelResponse(completion.choices[0]?.message.content ?? null);
    if (!parsed) {
      completion = await createCompletion(true);
      parsed = parseModelResponse(completion.choices[0]?.message.content ?? null);
    }
    if (!parsed) {
      throw new Error("The model returned an invalid structured response.");
    }

    const result: ChatResponse = {
      answer: parsed.answer,
      language: parsed.language,
      resources: resolveResources(parsed.resourceIds),
    };
    return NextResponse.json(result);
  } catch (error) {
    const providerStatus = getProviderStatus(error);
    console.error(
      "Groq chat request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    if (providerStatus === 429) {
      return errorResponse(localizedError("provider-limit", language), 503);
    }
    if (providerStatus === 404 || providerStatus === 422) {
      return errorResponse(localizedError("unavailable", language), 503);
    }
    return errorResponse(
      localizedError("unavailable", language),
      502,
    );
  }
}
