import Image from "next/image";
import { ExternalLink, FileText, Github } from "lucide-react";
import type { ChatResource } from "@/lib/chatbot/types";

interface ChatResourceCardProps {
  resource: ChatResource;
}

const labels: Record<ChatResource["type"], string> = {
  project: "View project",
  certificate: "View certificate",
  pdf: "View CV",
  image: "View image",
  github: "Open GitHub",
  link: "Open link",
};

export default function ChatResourceCard({ resource }: ChatResourceCardProps) {
  const isExternal = /^https?:\/\//.test(resource.url);
  const Icon = resource.type === "github" ? Github : resource.type === "pdf" ? FileText : ExternalLink;

  return (
    <a
      href={resource.url}
      target={isExternal || resource.type === "pdf" || resource.type === "certificate" ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex gap-3 overflow-hidden rounded-xl border border-[#334155] bg-[#0F172A]/80 p-3 transition hover:border-[#3B82F6]"
    >
      {resource.image && (
        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#020617]">
          <Image src={resource.image} alt="" fill sizes="64px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#60A5FA]">
          {resource.type}
        </p>
        <p className="truncate text-xs font-medium text-white">{resource.title}</p>
        {resource.description && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[#94A3B8]">{resource.description}</p>
        )}
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#60A5FA]">
          {labels[resource.type]} <Icon size={11} />
        </span>
      </div>
    </a>
  );
}
