import type { Locale } from "@/i18n/config";
import type { ChatUiMessage } from "@/lib/chatbot/types";
import ChatResourceCard, { type ChatResourceLabels } from "./ChatResourceCard";

interface ChatMessageProps {
  message: ChatUiMessage;
  locale?: Locale;
  userLabel?: string;
  assistantLabel?: string;
  resourceLabels?: Partial<ChatResourceLabels>;
}

export default function ChatMessage({
  message,
  locale = "en",
  userLabel = "You",
  assistantLabel = "Assistant",
  resourceLabels,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[88%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          dir="auto"
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-ee-md bg-[#2563EB] text-white"
              : message.isError
                ? "rounded-es-md border border-red-300/50 bg-red-500/10 text-red-100"
                : "rounded-es-md border border-[#475569] bg-[#1E293B]/80 text-[#E2E8F0]"
          }`}
        >
          <span className="sr-only">{isUser ? userLabel : assistantLabel}: </span>
          {message.content}
        </div>
        {message.resources && message.resources.length > 0 && (
          <div className="mt-2 grid gap-2">
            {message.resources.map((resource) => (
              <ChatResourceCard key={resource.id} resource={resource} locale={locale} labels={resourceLabels} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
