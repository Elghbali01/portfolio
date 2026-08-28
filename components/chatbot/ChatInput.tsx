"use client";

import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/chatbot/types";

export interface ChatInputLabels {
  placeholder: string;
  inputLabel: string;
  send: string;
  disclaimer: string;
}

const defaults: ChatInputLabels = {
  placeholder: "Ask about Issam...",
  inputLabel: "Message for Issam’s AI assistant",
  send: "Send message",
  disclaimer: "Answers use Issam’s documented portfolio and CV only.",
};

interface ChatInputProps {
  loading: boolean;
  onSend: (message: string) => void;
  labels?: Partial<ChatInputLabels>;
}

export default function ChatInput({ loading, onSend, labels }: ChatInputProps) {
  const copy = { ...defaults, ...labels };
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
    <div className="border-t border-[#475569] bg-[#0B1120]/95 p-3">
      <div className="flex items-end gap-2 rounded-xl border border-[#526176] bg-[#020617]/60 p-2 focus-within:border-[#60A5FA]">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          rows={1}
          dir="auto"
          disabled={loading}
          placeholder={copy.placeholder}
          aria-label={copy.inputLabel}
          className="max-h-24 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-[#8FA0B8]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading || !value.trim()}
          aria-label={copy.send}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send aria-hidden="true" size={17} />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[11px] text-[#A8B6CA]">{copy.disclaimer}</p>
    </div>
  );
}
