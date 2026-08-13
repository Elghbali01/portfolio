import {
  CHAT_HISTORY_MAX_MESSAGES,
  CHAT_MESSAGE_MAX_LENGTH,
  type ChatHistoryMessage,
  type ChatLanguage,
} from "./types";

type ValidatedChatRequest = {
  message: string;
  history: ChatHistoryMessage[];
  preferredLanguage?: ChatLanguage;
};

type ValidationResult =
  | { ok: true; data: ValidatedChatRequest }
  | { ok: false; error: string };

function isHistoryMessage(value: unknown): value is ChatHistoryMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= CHAT_MESSAGE_MAX_LENGTH
  );
}

export function validateChatRequest(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Invalid request body." };
  }

  const body = value as Record<string, unknown>;
  if (typeof body.message !== "string" || !body.message.trim()) {
    return { ok: false, error: "Message is required." };
  }
  if (body.message.length > CHAT_MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      error: `Message must be ${CHAT_MESSAGE_MAX_LENGTH} characters or fewer.`,
    };
  }

  const history = body.history ?? [];
  if (!Array.isArray(history) || history.length > CHAT_HISTORY_MAX_MESSAGES) {
    return { ok: false, error: "Conversation history is invalid or too long." };
  }
  if (!history.every(isHistoryMessage)) {
    return { ok: false, error: "Conversation history contains invalid messages." };
  }

  const supportedLanguages: ChatLanguage[] = ["en", "fr", "ar", "darija"];
  if (
    body.preferredLanguage !== undefined &&
    !supportedLanguages.includes(body.preferredLanguage as ChatLanguage)
  ) {
    return { ok: false, error: "Preferred language is invalid." };
  }

  return {
    ok: true,
    data: {
      message: body.message.trim(),
      history,
      preferredLanguage: body.preferredLanguage as ChatLanguage | undefined,
    },
  };
}
