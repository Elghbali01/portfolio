export type ProjectTextDirection = "ltr" | "rtl";

export interface ProjectContentParagraph {
  type: "paragraph";
  text: string;
}

export interface ProjectContentList {
  type: "list";
  items: readonly string[];
}

export type ProjectContentBlock =
  | ProjectContentParagraph
  | ProjectContentList;

export interface ProjectContentSubsection {
  id?: string;
  heading: string;
  blocks: readonly ProjectContentBlock[];
}

export interface ProjectContentSection {
  id?: string;
  heading: string;
  blocks?: readonly ProjectContentBlock[];
  subsections?: readonly ProjectContentSubsection[];
}

/**
 * A language-neutral content shape for project case studies.
 *
 * Localized EN, FR, or AR content can use this shape directly instead of
 * passing through the legacy text parser. Facts such as metrics and technical
 * names therefore remain explicit data rather than generated HTML.
 */
export interface ProjectContent {
  lang?: string;
  dir?: ProjectTextDirection;
  technologyTerms?: readonly string[];
  introduction?: readonly ProjectContentBlock[];
  sections: readonly ProjectContentSection[];
}

export type ProjectContentInput = string | ProjectContent;
export type ProjectCaseStudyContent = ProjectContent;

interface DraftSubsection {
  heading: string;
  blocks: ProjectContentBlock[];
}

interface DraftSection {
  heading: string;
  blocks: ProjectContentBlock[];
  subsections: DraftSubsection[];
}

const SUBSECTION_HEADING_PATTERN =
  /^(?:(?:phase|step|stage|étape)\s*[0-9٠-٩]+|(?:المرحلة|مرحلة)\s*[0-9٠-٩]+)/iu;

const SUBSECTION_GROUP_PATTERN =
  /(?:phases?|steps?|stages?|étapes?|مراحل|المراحل)/iu;

function parseMarkedHeading(line: string): string | null {
  const match = line.match(/^\*\*\s*(.+?)\s*\*\*\s*[:：]?\s*$/u);

  if (!match) {
    return null;
  }

  const heading = match[1].replace(/[:：]\s*$/u, "").trim();
  return heading || null;
}

function shouldNestHeading(
  heading: string,
  currentSection: DraftSection | undefined,
): currentSection is DraftSection {
  if (!currentSection || !SUBSECTION_HEADING_PATTERN.test(heading)) {
    return false;
  }

  return (
    SUBSECTION_GROUP_PATTERN.test(currentSection.heading) ||
    currentSection.subsections.length > 0
  );
}

/**
 * Converts the existing, deliberately small pseudo-Markdown format into safe,
 * structured data. It supports paragraphs, `-` lists, `**Section:**` headings,
 * and numbered phase subheadings. It never interprets or returns HTML.
 */
export function parseProjectContent(source: string): ProjectContent {
  const introduction: ProjectContentBlock[] = [];
  const sections: DraftSection[] = [];

  let currentSection: DraftSection | undefined;
  let currentSubsection: DraftSubsection | undefined;
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const currentBlocks = (): ProjectContentBlock[] =>
    currentSubsection?.blocks ?? currentSection?.blocks ?? introduction;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    currentBlocks().push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    currentBlocks().push({ type: "list", items: listItems });
    listItems = [];
  };

  const flushBlocks = () => {
    flushParagraph();
    flushList();
  };

  for (const rawLine of source.replace(/\r\n?/gu, "\n").split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flushBlocks();
      continue;
    }

    const heading = parseMarkedHeading(line);

    if (heading) {
      flushBlocks();

      if (shouldNestHeading(heading, currentSection)) {
        currentSubsection = { heading, blocks: [] };
        currentSection.subsections.push(currentSubsection);
      } else {
        currentSection = { heading, blocks: [], subsections: [] };
        sections.push(currentSection);
        currentSubsection = undefined;
      }

      continue;
    }

    const listItem = line.match(/^-\s+(.+)$/u);

    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1].trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushBlocks();

  return {
    introduction,
    sections,
  };
}
