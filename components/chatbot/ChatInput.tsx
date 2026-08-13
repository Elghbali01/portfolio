"use client";

import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/chatbot/types";

interface ChatInputProps {
  loading: boolean;
  onSend: (message: string) => void;
}

export default function ChatInput({ loading, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const message = value.trim();
    if (!message || loading) return;
    onSend(message);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-[#334155] bg-[#0B1120]/95 p-3">
      <div className="flex items-end gap-2 rounded-xl border border-[#334155] bg-[#020617]/60 p-2 focus-within:border-[#3B82F6]">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          rows={1}
          disabled={loading}
          placeholder="Ask about Issam..."
          aria-label="Message for Issam's AI assistant"
          className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-[#64748B]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading || !value.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-[#64748B]">
        Answers use Issam&apos;s documented portfolio and CV only.
      </p>
    </div>
  );
}
