import type { ChatUiMessage } from "@/lib/chatbot/types";
import ChatResourceCard from "./ChatResourceCard";

interface ChatMessageProps {
  message: ChatUiMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[88%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          dir="auto"
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-md bg-[#3B82F6] text-white"
              : message.isError
                ? "rounded-bl-md border border-red-400/30 bg-red-500/10 text-red-100"
                : "rounded-bl-md border border-[#334155] bg-[#1E293B]/80 text-[#E2E8F0]"
          }`}
        >
          {message.content}
        </div>
        {message.resources && message.resources.length > 0 && (
          <div className="mt-2 grid gap-2">
            {message.resources.map((resource) => (
              <ChatResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
