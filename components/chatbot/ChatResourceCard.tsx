import Image from "next/image";
import { ExternalLink, FileText, Github } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ChatResource } from "@/lib/chatbot/types";

export type ChatResourceLabels = Record<ChatResource["type"], string> & {
  opensNewTab: string;
};

const defaults: ChatResourceLabels = {
  project: "View project",
  certificate: "Verify certificate",
  pdf: "View CV",
  image: "View image",
  github: "Open GitHub",
  link: "Open link",
  opensNewTab: "opens in a new tab",
};

interface ChatResourceCardProps {
  resource: ChatResource;
  locale?: Locale;
  labels?: Partial<ChatResourceLabels>;
}

function localizeInternalUrl(url: string, locale: Locale) {
  if (/^\/en(?:\/|$)/.test(url)) return url.replace(/^\/en(?=\/|$)/, `/${locale}`);
  if (/^\/projects(?:\/|#|$)/.test(url)) return `/${locale}${url}`;
  if (/^\/certifications(?:\/|#|$)/.test(url)) return `/${locale}${url}`;
  return url;
}

export default function ChatResourceCard({ resource, locale = "en", labels }: ChatResourceCardProps) {
  const copy = { ...defaults, ...labels };
  const href = localizeInternalUrl(resource.url, locale);
  const isExternal = /^https?:\/\//.test(href);
  const opensNewTab = isExternal || resource.type === "pdf" || resource.type === "certificate";
  const Icon = resource.type === "github" ? Github : resource.type === "pdf" ? FileText : ExternalLink;

  return (
    <a
      href={href}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      aria-label={opensNewTab ? `${copy[resource.type]}: ${resource.title} (${copy.opensNewTab})` : undefined}
      className="group flex gap-3 overflow-hidden rounded-xl border border-[#475569] bg-[#0F172A]/80 p-3 transition hover:border-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
    >
      {resource.image && (
        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#020617]">
          <Image src={resource.image} alt="" fill sizes="64px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1 text-start">
        <p className="text-[10px] font-semibold text-[#93C5FD]">{copy[resource.type]}</p>
        <p className="truncate text-xs font-medium text-white" dir="auto">{resource.title}</p>
        {resource.description && (
          <p className="mt-0.5 line-clamp-2 text-[11px] text-[#B7C3D4]" dir="auto">{resource.description}</p>
        )}
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#93C5FD]">
          {copy[resource.type]} <Icon aria-hidden="true" size={11} />
        </span>
      </div>
    </a>
  );
}
