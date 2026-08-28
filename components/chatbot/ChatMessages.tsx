"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { ChatUiMessage } from "@/lib/chatbot/types";
import type { ChatResourceLabels } from "./ChatResourceCard";
import ChatMessage from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatUiMessage[];
  loading: boolean;
  locale?: Locale;
  userLabel?: string;
  assistantLabel?: string;
  thinkingLabel?: string;
  resourceLabels?: Partial<ChatResourceLabels>;
}

export default function ChatMessages({
  messages,
  loading,
  locale = "en",
  userLabel,
  assistantLabel,
  thinkingLabel = "Assistant is thinking",
  resourceLabels,
}: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, loading]);

  return (
    <div
      role="log"
      className="flex-1 space-y-4 overflow-y-auto px-4 py-5 [scrollbar-color:#475569_transparent]"
      aria-live="polite"
      aria-busy={loading}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          locale={locale}
          userLabel={userLabel}
          assistantLabel={assistantLabel}
          resourceLabels={resourceLabels}
        />
      ))}
      {loading && (
        <div className="flex justify-start" role="status" aria-label={thinkingLabel}>
          <div className="flex items-center gap-1 rounded-2xl rounded-es-md border border-[#475569] bg-[#1E293B]/80 px-4 py-3">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#60A5FA] motion-reduce:animate-none"
                style={{ animationDelay: `${dot * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
