"use client";

import { useEffect, useRef } from "react";
import type { ChatUiMessage } from "@/lib/chatbot/types";
import ChatMessage from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatUiMessage[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto px-4 py-5 [scrollbar-color:#334155_transparent]"
      aria-live="polite"
      aria-busy={loading}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#334155] bg-[#1E293B]/80 px-4 py-3" aria-label="Thinking">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#60A5FA]"
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
