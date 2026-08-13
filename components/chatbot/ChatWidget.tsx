"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ChatLanguage, ChatResponse, ChatUiMessage } from "@/lib/chatbot/types";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const suggestions = [
  "Tell me about Issam",
  "Show his best projects",
  "What are his main skills?",
  "Show his certifications",
];

const welcomeMessage: ChatUiMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I’m Issam’s AI Portfolio Assistant. Ask me about his experience, projects, skills, education, or certifications. My answers are based only on information documented in his portfolio and CV.",
};

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatUiMessage[]>([welcomeMessage]);
  const [loading, setLoading] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<ChatLanguage>(() => {
    if (typeof navigator === "undefined") return "en";
    const language = navigator.language.toLocaleLowerCase();
    if (language.startsWith("fr")) return "fr";
    if (language.startsWith("ar")) return "ar";
    return "en";
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(isOpen);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const sendMessage = async (content: string) => {
    if (loading) return;

    const history = messages
      .filter((message) => message.id !== "welcome" && !message.isError)
      .slice(-6)
      .map((message) => ({ role: message.role, content: message.content }));
    const userMessage: ChatUiMessage = {
      id: createMessageId(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history, preferredLanguage }),
      });
      const payload = (await response.json()) as ChatResponse | { error?: string };

      if (!response.ok || !("answer" in payload)) {
        throw new Error("error" in payload ? payload.error : undefined);
      }

      if (payload.languagePreference) setPreferredLanguage(payload.languagePreference);

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: payload.answer,
          resources: payload.resources,
        },
      ]);
      if (!isOpenRef.current) setUnreadCount((count) => count + 1);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content:
            error instanceof Error && error.message
              ? error.message
              : "I couldn’t reach the assistant. Please check your connection and try again.",
          isError: true,
        },
      ]);
      if (!isOpenRef.current) setUnreadCount((count) => count + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-modal="false"
            aria-label="Issam's AI Portfolio Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex h-[min(680px,calc(100dvh-6rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#334155] bg-[#0B1120]/95 text-white shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-[400px]"
          >
            <header className="flex items-center justify-between border-b border-[#334155] bg-[#1E293B]/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#60A5FA]">
                  <Bot size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Ask Issam’s AI Assistant</h2>
                  <p className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Portfolio guide
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI assistant"
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <X size={18} />
              </button>
            </header>

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 border-b border-[#334155]/70 px-4 py-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                    className="rounded-full border border-[#334155] bg-[#1E293B]/50 px-3 py-1.5 text-left text-[11px] text-[#CBD5E1] transition hover:border-[#3B82F6] hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <ChatMessages messages={messages} loading={loading} />
            <ChatInput loading={loading} onSend={sendMessage} />
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        animate={
          unreadCount > 0 && !shouldReduceMotion
            ? { scale: [1, 1.08, 1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.8, repeat: 0 }}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        className="relative ml-auto flex h-14 items-center gap-2 rounded-2xl border border-[#60A5FA]/40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] focus:ring-offset-2 focus:ring-offset-[#020617]"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        {!isOpen && <span className="hidden sm:inline">Issam Assistant</span>}
        {!isOpen && <Sparkles size={14} className="text-blue-100" />}
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#020617] bg-red-500 px-1 text-[10px] font-bold text-white"
            aria-label={`${unreadCount} unread assistant response${unreadCount > 1 ? "s" : ""}`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
