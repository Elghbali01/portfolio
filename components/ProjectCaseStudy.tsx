import type { ReactNode } from "react";
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
          className="list-disc space-y-2 ps-6 marker:text-[#60A5FA]"
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
      className={`mx-auto max-w-3xl space-y-10 text-start text-[#CBD5E1] leading-8 ${className}`.trim()}
    >
      {parsedContent.introduction && parsedContent.introduction.length > 0 && (
        <div className="space-y-4">
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

        return (
          <section key={sectionKey} className="space-y-4">
            <h2
              id={section.id}
              className="scroll-mt-28 text-2xl font-bold leading-tight text-white md:text-3xl"
            >
              {renderTextWithBidiIsolation(section.heading, technologyTerms, rtl)}
            </h2>

            <ContentBlocks
              blocks={section.blocks}
              technologyTerms={technologyTerms}
              rtl={rtl}
              keyPrefix={`${sectionKey}-content`}
            />

            {section.subsections?.map((subsection, subsectionIndex) => {
              const subsectionKey =
                subsection.id ?? `${sectionKey}-subsection-${subsectionIndex}`;

              return (
                <section
                  key={subsectionKey}
                  className="space-y-3 border-s-2 border-[#334155] ps-4 md:ps-6"
                >
                  <h3
                    id={subsection.id}
                    className="scroll-mt-28 text-xl font-semibold leading-tight text-white md:text-2xl"
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
