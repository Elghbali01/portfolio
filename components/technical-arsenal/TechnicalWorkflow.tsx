"use client";

import { ArrowDown } from "lucide-react";
import { formatLocalizedNumber, type Locale } from "@/i18n";
import type { TechnicalWorkflow as TechnicalWorkflowData } from "@/lib/technical-arsenal";

interface TechnicalWorkflowProps {
  workflow: TechnicalWorkflowData;
  projectTitle: string;
  title: string;
  directionLabel: string;
  selectedSkillId: string;
  locale: Locale;
  selectTechnologyLabel: string;
  onSelectSkill: (skillId: string) => void;
}

export default function TechnicalWorkflow({
  workflow,
  projectTitle,
  title,
  directionLabel,
  selectedSkillId,
  locale,
  selectTechnologyLabel,
  onSelectSkill,
}: TechnicalWorkflowProps) {
  return (
    <section aria-labelledby="technical-workflow-heading" className="rounded-2xl border border-outline-subtle bg-surface-elevated/45 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 id="technical-workflow-heading" className="text-sm font-semibold text-content-primary">{title}</h4>
          <p className="mt-1 text-xs text-content-secondary">{projectTitle}</p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-content-muted">{directionLabel}</p>
      </div>

      <figure dir="ltr" aria-label={`${title}: ${projectTitle}`}>
        <figcaption className="sr-only">{workflow.heading}</figcaption>
        <ol className="flex flex-col items-stretch">
          {workflow.nodes.map((node, index) => {
            const associatedSkillId = node.skillIds[0];
            const isSelected = node.skillIds.includes(selectedSkillId);
            const number = formatLocalizedNumber(index + 1, locale, {
              minimumIntegerDigits: 2,
              useGrouping: false,
            });
            const nodeContent = (
              <>
                <span aria-hidden="true" className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.65rem] font-semibold tabular-nums text-accent">
                  {number}
                </span>
                <span dir="auto" className="min-w-0 text-start text-xs font-medium leading-snug text-content-strong sm:text-sm">
                  {node.label}
                </span>
              </>
            );

            return (
              <li key={node.id} className="flex flex-col items-center">
                {associatedSkillId ? (
                  <button
                    type="button"
                    aria-label={selectTechnologyLabel.replace("{technology}", node.label)}
                    aria-pressed={isSelected}
                    onClick={() => onSelectSkill(associatedSkillId)}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:px-4 ${isSelected
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-outline-default bg-surface hover:border-accent"
                    }`}
                  >
                    {nodeContent}
                  </button>
                ) : (
                  <div className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-outline-default bg-surface px-3 py-2.5 sm:px-4">
                    {nodeContent}
                  </div>
                )}
                {index < workflow.nodes.length - 1 && (
                  <ArrowDown aria-hidden="true" className="my-1.5 size-4 text-accent" />
                )}
              </li>
            );
          })}
        </ol>
      </figure>
    </section>
  );
}
