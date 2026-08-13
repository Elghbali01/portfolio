export const CHAT_MESSAGE_MAX_LENGTH = 1_000;
export const CHAT_HISTORY_MAX_MESSAGES = 6;

export type ChatLanguage = "en" | "fr" | "ar" | "darija";
export type ChatRole = "user" | "assistant";
export type ChatResourceType =
  | "project"
  | "certificate"
  | "pdf"
  | "image"
  | "github"
  | "link";

export interface ChatResource {
  id: string;
  type: ChatResourceType;
  title: string;
  description?: string;
  url: string;
  image?: string;
}

export interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatHistoryMessage[];
  preferredLanguage?: ChatLanguage;
}

export interface ChatResponse {
  answer: string;
  language: ChatLanguage;
  resources: ChatResource[];
  languagePreference?: ChatLanguage;
}

export interface ChatUiMessage {
  id: string;
  role: ChatRole;
  content: string;
  resources?: ChatResource[];
  isError?: boolean;
}
