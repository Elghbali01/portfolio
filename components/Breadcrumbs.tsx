import Link from "next/link";
import type { Locale } from "@/i18n/config";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  locale: Locale;
  label: string;
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ locale, label, items }: BreadcrumbsProps) {
  const isRtl = locale === "ar";

  return (
    <nav aria-label={label} className="mb-10 text-sm text-content-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-accent">
                  {isRtl ? "‹" : "›"}
                </span>
              )}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined} className="truncate text-content-primary">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
