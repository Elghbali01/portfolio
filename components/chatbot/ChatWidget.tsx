"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ChatLanguage, ChatResponse, ChatUiMessage } from "@/lib/chatbot/types";
import ChatInput, { type ChatInputLabels } from "./ChatInput";
import ChatMessages from "./ChatMessages";
import type { ChatResourceLabels } from "./ChatResourceCard";

export interface ChatWidgetLabels {
  suggestions: string[];
  welcome: string;
  dialogLabel: string;
  title: string;
  status: string;
  open: string;
  close: string;
  launcher: string;
  unreadOne: string;
  unreadMany: string;
  error: string;
  user: string;
  assistant: string;
  thinking: string;
  input: ChatInputLabels;
  resources: ChatResourceLabels;
}

const defaults: ChatWidgetLabels = {
  suggestions: [
    "Tell me about Issam",
    "Show his best projects",
    "What are his main skills?",
    "Show his certifications",
  ],
  welcome:
    "Hi! I’m Issam’s AI Portfolio Assistant. Ask me about his experience, projects, skills, education, or certifications. My answers are based only on information documented in his portfolio and CV.",
  dialogLabel: "Issam’s AI Portfolio Assistant",
  title: "Issam Assistant",
  status: "Portfolio guide",
  open: "Open AI assistant",
  close: "Close AI assistant",
  launcher: "Issam Assistant",
  unreadOne: "1 unread assistant response",
  unreadMany: "{count} unread assistant responses",
  error: "I couldn’t reach the assistant. Please check your connection and try again.",
  user: "You",
  assistant: "Assistant",
  thinking: "Assistant is thinking",
  input: {
    placeholder: "Ask about Issam...",
    inputLabel: "Message for Issam’s AI assistant",
    send: "Send message",
    disclaimer: "Answers use Issam’s documented portfolio and CV only.",
  },
  resources: {
    project: "View project",
    certificate: "Verify certificate",
    pdf: "View CV",
    image: "View image",
    github: "Open GitHub",
    link: "Open link",
    opensNewTab: "opens in a new tab",
  },
};

interface ChatWidgetProps {
  locale?: Locale;
  labels?: Partial<Omit<ChatWidgetLabels, "input" | "resources">> & {
    input?: Partial<ChatInputLabels>;
    resources?: Partial<ChatResourceLabels>;
  };
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatWidget({ locale = "en", labels }: ChatWidgetProps) {
  const copy: ChatWidgetLabels = useMemo(
    () => ({
      ...defaults,
      ...labels,
      input: { ...defaults.input, ...labels?.input },
      resources: { ...defaults.resources, ...labels?.resources },
    }),
    [labels],
  );
  const welcomeMessage = useMemo<ChatUiMessage>(
    () => ({ id: `welcome-${locale}`, role: "assistant", content: copy.welcome }),
    [copy.welcome, locale],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatUiMessage[]>([welcomeMessage]);
  const [loading, setLoading] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<ChatLanguage>(locale);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [avoidCtas, setAvoidCtas] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMessages([welcomeMessage]);
    setPreferredLanguage(locale);
  }, [locale, welcomeMessage]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile || isOpen) {
      setAvoidCtas(false);
      return;
    }
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-chat-safe-zone]"));
    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleTargets.add(entry.target);
          else visibleTargets.delete(entry.target);
        });
        setAvoidCtas(visibleTargets.size > 0);
      },
      { threshold: 0.15 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [isMobile, isOpen]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      launcherRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (!isMobile || event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isOpen || !isMobile || !rootRef.current) return;
    const siblings = Array.from(document.body.children).filter((child) => !child.contains(rootRef.current));
    const previous = siblings.map((element) => ({
      element: element as HTMLElement,
      inert: (element as HTMLElement).inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));
    previous.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    return () => {
      previous.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
    };
  }, [isMobile, isOpen]);

  const sendMessage = async (content: string) => {
    if (loading) return;

    const history = messages
      .filter((message) => !message.id.startsWith("welcome-") && !message.isError)
      .slice(-6)
      .map((message) => ({ role: message.role, content: message.content }));
    const userMessage: ChatUiMessage = { id: createMessageId(), role: "user", content };

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
        throw new Error();
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
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: copy.error,
          isError: true,
        },
      ]);
      if (!isOpenRef.current) setUnreadCount((count) => count + 1);
    } finally {
      setLoading(false);
    }
  };

  const localizedUnreadCount = new Intl.NumberFormat(locale).format(unreadCount);
  const unreadLabel = (unreadCount === 1 ? copy.unreadOne : copy.unreadMany).replace(
    "{count}",
    localizedUnreadCount,
  );
  const launcherLabel = isOpen
    ? copy.close
    : unreadCount > 0
      ? `${copy.open}. ${unreadLabel}`
      : copy.open;
  const hideLauncher = (avoidCtas && !isOpen) || (isMobile && isOpen);

  return (
    <div ref={rootRef} className="fixed bottom-4 end-4 z-[100] sm:bottom-6 sm:end-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-modal={isMobile ? "true" : "false"}
            aria-label={copy.dialogLabel}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            className="mb-3 flex h-[min(680px,calc(100dvh-6rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#475569] bg-[#0B1120]/98 text-white shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-[400px]"
          >
            <header className="flex items-center justify-between border-b border-[#475569] bg-[#1E293B]/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#93C5FD]">
                  <Bot aria-hidden="true" size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">{copy.title}</h2>
                  <p className="flex items-center gap-1 text-[11px] text-[#B7C3D4]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {copy.status}
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={copy.close}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#B7C3D4] transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </header>

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 border-b border-[#475569]/70 px-4 py-3">
                {copy.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                    className="rounded-full border border-[#526176] bg-[#1E293B]/50 px-3 py-2 text-start text-[11px] text-[#D4DCE8] transition hover:border-[#60A5FA] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <ChatMessages
              messages={messages}
              loading={loading}
              locale={locale}
              userLabel={copy.user}
              assistantLabel={copy.assistant}
              thinkingLabel={copy.thinking}
              resourceLabels={copy.resources}
            />
            <ChatInput loading={loading} onSend={sendMessage} labels={copy.input} />
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        animate={unreadCount > 0 && !shouldReduceMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        aria-label={launcherLabel}
        aria-expanded={isOpen}
        aria-hidden={hideLauncher ? "true" : undefined}
        tabIndex={hideLauncher ? -1 : 0}
        disabled={isMobile && isOpen}
        className={`relative ms-auto flex h-14 min-w-14 items-center justify-center gap-2 rounded-2xl border border-[#93C5FD]/60 bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] px-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] sm:px-4 ${
          hideLauncher ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {isOpen ? <X aria-hidden="true" size={20} /> : <MessageCircle aria-hidden="true" size={20} />}
        {!isOpen && <span className="hidden sm:inline">{copy.launcher}</span>}
        {!isOpen && <Sparkles aria-hidden="true" size={14} className="hidden text-blue-100 sm:block" />}
        {!isOpen && unreadCount > 0 && (
          <span aria-hidden="true" className="absolute -end-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#020617] bg-red-700 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
