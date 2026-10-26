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
              ? "rounded-ee-md bg-action text-on-action"
              : message.isError
                ? "rounded-es-md border border-state-error/50 bg-state-error/10 text-state-error"
                : "rounded-es-md border border-outline-default bg-surface-elevated/80 text-content-strong"
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
