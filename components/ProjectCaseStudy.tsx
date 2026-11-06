import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import {
  parseProjectContent,
  type ProjectContentBlock,
  type ProjectContentInput,
  type ProjectTextDirection,
} from "@/lib/project-content";

interface ProjectCaseStudyProps {
  content: ProjectContentInput;
  technologies?: readonly string[];
  lang?: string;
  dir?: ProjectTextDirection;
  className?: string;
  architectureDiagramLabel?: string;
  projectTitle?: string;
}

interface ContentBlocksProps {
  blocks?: readonly ProjectContentBlock[];
  technologyTerms: readonly string[];
  rtl: boolean;
  keyPrefix: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function uniqueTechnologyTerms(terms: readonly string[]): string[] {
  return [...new Set(terms.map((term) => term.trim()).filter(Boolean))].sort(
    (left, right) => right.length - left.length,
  );
}

function renderTextWithBidiIsolation(
  text: string,
  technologyTerms: readonly string[],
  rtl = false,
): ReactNode {
  if (technologyTerms.length === 0 && !rtl) {
    return text;
  }

  const termSet = new Set(technologyTerms);
  const ltrTokenPattern = String.raw`(?:\.[A-Za-z0-9]+|[A-Za-z0-9][A-Za-z0-9+.#/@_:%?,=&-]*(?:\s+[A-Za-z0-9][A-Za-z0-9+.#/@_:%?,=&-]*)*)`;
  const patternParts = technologyTerms.map(escapeRegExp);
  if (rtl) patternParts.push(ltrTokenPattern);
  const pattern = new RegExp(
    `(${patternParts.join("|")})`,
    "gu",
  );

  return text.split(pattern).map((part, index) => {
    const shouldIsolate = termSet.has(part) || (rtl && /[A-Za-z0-9]/u.test(part));
    return shouldIsolate ? (
      <bdi
        key={`${part}-${index}`}
        dir="ltr"
        lang={/[A-Za-z]/u.test(part) ? "en" : undefined}
        className="font-medium"
      >
        {part}
      </bdi>
    ) : (
      part
    );
  });
}

function ContentBlocks({
  blocks = [],
  technologyTerms,
  rtl,
  keyPrefix,
}: ContentBlocksProps) {
  return blocks.map((block, blockIndex) => {
    const key = `${keyPrefix}-${block.type}-${blockIndex}`;

    if (block.type === "list") {
      return (
        <ul
          key={key}
          className="list-disc space-y-2 ps-6 marker:text-accent"
        >
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-item-${itemIndex}`}>
              {renderTextWithBidiIsolation(item, technologyTerms, rtl)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={key}>
        {renderTextWithBidiIsolation(block.text, technologyTerms, rtl)}
      </p>
    );
  });
}

function inferDirection(lang: string | undefined): ProjectTextDirection | undefined {
  if (!lang) {
    return undefined;
  }

  return lang.toLowerCase().startsWith("ar") ? "rtl" : "ltr";
}

function ArchitectureFlow({
  flow,
  label,
  lang,
}: {
  flow: readonly string[];
  label: string;
  lang: string;
}) {
  if (flow.length === 0) return null;

  return (
    <figure
      aria-label={label}
      dir="ltr"
      className="rounded-2xl border border-outline-subtle bg-surface-elevated/70 p-4 md:p-5"
    >
      <figcaption dir="auto" className="mb-4 text-start text-xs font-semibold uppercase tracking-[0.14em] text-content-muted">{label}</figcaption>
      <ol className="mx-auto flex max-w-md flex-col items-stretch">
        {flow.map((step, index) => (
          <li key={`${step}-${index}`} className="flex flex-col items-center">
            <div className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-outline-default bg-surface px-4 py-3 shadow-sm">
              <span
                aria-hidden="true"
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent"
              >
                {new Intl.NumberFormat(lang, { minimumIntegerDigits: 2, useGrouping: false }).format(index + 1)}
              </span>
              <span dir="auto" className="min-w-0 text-sm font-medium text-content-strong">
                {step}
              </span>
            </div>
            {index < flow.length - 1 && (
              <ArrowDown aria-hidden="true" className="my-1 size-4 text-accent" />
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}

/**
 * Renders either legacy project descriptions or localized structured content.
 * Text is rendered as React children; no HTML string is injected.
 */
export default function ProjectCaseStudy({
  content,
  technologies = [],
  lang,
  dir,
  className = "",
  architectureDiagramLabel = "Architecture flow",
  projectTitle = "",
}: ProjectCaseStudyProps) {
  const parsedContent =
    typeof content === "string" ? parseProjectContent(content) : content;
  const resolvedLang = lang ?? parsedContent.lang;
  const resolvedDir = dir ?? parsedContent.dir ?? inferDirection(resolvedLang);
  const rtl = resolvedDir === "rtl";
  const technologyTerms = uniqueTechnologyTerms([
    ...technologies,
    ...(parsedContent.technologyTerms ?? []),
  ]);

  return (
    <div
      lang={resolvedLang}
      dir={resolvedDir}
      className={`space-y-12 text-start text-content-secondary leading-8 ${className}`.trim()}
    >
      {parsedContent.introduction && parsedContent.introduction.length > 0 && (
        <div className="rounded-2xl border border-outline-subtle border-s-4 border-s-accent bg-surface-elevated/60 p-5 text-lg leading-relaxed text-content-strong md:p-7">
          <ContentBlocks
            blocks={parsedContent.introduction}
            technologyTerms={technologyTerms}
            rtl={rtl}
            keyPrefix="introduction"
          />
        </div>
      )}

      {parsedContent.sections.map((section, sectionIndex) => {
        const sectionKey = section.id ?? `section-${sectionIndex}`;
        const headingId = `${sectionKey}-heading`;
        const number = new Intl.NumberFormat(resolvedLang, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }).format(sectionIndex + 1);

        return (
          <section
            key={sectionKey}
            id={section.id}
            aria-labelledby={headingId}
            className="scroll-mt-28 space-y-5 border-t border-outline-subtle pt-8 md:pt-10"
          >
            <div className="flex items-start gap-4">
              <span aria-hidden="true" dir="ltr" className="pt-1 text-sm font-semibold tracking-[0.16em] text-accent">
                {number}
              </span>
              <h2 id={headingId} className="text-2xl font-bold leading-tight text-content-primary md:text-3xl">
                {renderTextWithBidiIsolation(section.heading, technologyTerms, rtl)}
              </h2>
            </div>

            <div className={section.architectureFlow ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)] lg:items-start" : "space-y-5"}>
              {section.blocks && section.blocks.length > 0 && (
                <div className="space-y-4">
                  <ContentBlocks
                    blocks={section.blocks}
                    technologyTerms={technologyTerms}
                    rtl={rtl}
                    keyPrefix={`${sectionKey}-content`}
                  />
                </div>
              )}
              {section.architectureFlow && (
                <ArchitectureFlow
                  flow={section.architectureFlow}
                  label={architectureDiagramLabel.replace("{project}", projectTitle)}
                  lang={resolvedLang ?? "en"}
                />
              )}
            </div>

            {section.metrics && section.metrics.length > 0 && (
              <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {section.metrics.map((metric) => (
                  <div key={`${metric.label}-${metric.value}`} className="rounded-2xl border border-outline-subtle bg-surface-elevated/65 p-4 md:p-5">
                    <dt className="text-sm text-content-secondary">{metric.label}</dt>
                    <dd className="mt-2 text-2xl font-semibold tracking-tight text-accent md:text-3xl">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {section.subsections?.map((subsection, subsectionIndex) => {
              const subsectionKey =
                subsection.id ?? `${sectionKey}-subsection-${subsectionIndex}`;

              return (
                <section
                  key={subsectionKey}
                  className="space-y-3 border-s-2 border-outline-subtle ps-4 md:ps-6"
                >
                  <h3
                    id={subsection.id}
                    className="scroll-mt-28 text-xl font-semibold leading-tight text-content-primary md:text-2xl"
                  >
                    {renderTextWithBidiIsolation(
                      subsection.heading,
                      technologyTerms,
                      rtl,
                    )}
                  </h3>

                  <ContentBlocks
                    blocks={subsection.blocks}
                    technologyTerms={technologyTerms}
                    rtl={rtl}
                    keyPrefix={`${subsectionKey}-content`}
                  />
                </section>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
