"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import RelatedProjectPreview from "@/components/technical-arsenal/RelatedProjectPreview";
import TechnicalCore from "@/components/technical-arsenal/TechnicalCore";
import TechnicalWorkflow from "@/components/technical-arsenal/TechnicalWorkflow";
import {
  skillDomainIds,
  type SkillDomainId,
} from "@/data/skills";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type {
  TechnicalArsenalDomain,
  TechnicalArsenalSkill,
} from "@/lib/technical-arsenal";

type IdentityId = "developer" | "data-scientist";

interface TechnicalArsenalExplorerProps {
  locale: Locale;
  content: Dictionary["skills"];
  domains: readonly TechnicalArsenalDomain[];
}

const domainIcons: Record<SkillDomainId, LucideIcon> = {
  "backend-engineering": Database,
  "frontend-engineering": Monitor,
  "data-science": Activity,
  "ai-machine-learning": BrainCircuit,
};

const identityDomains: Record<IdentityId, readonly SkillDomainId[]> = {
  developer: ["backend-engineering", "frontend-engineering"],
  "data-scientist": ["data-science", "ai-machine-learning"],
};

function TechnologyDetails({
  skill,
  content,
  domainTitle,
}: {
  skill: TechnicalArsenalSkill;
  content: Dictionary["skills"];
  domainTitle: string;
}) {
  const kindLabel = content.kindLabels[skill.kind];

  return (
    <aside id="selected-technology-details" aria-labelledby="technology-details-heading" className="rounded-2xl border border-outline-subtle bg-surface-elevated/60 p-4 sm:p-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent-soft">{content.technologyDetailsHeading}</p>
      <h4 id="technology-details-heading" className="mt-2 break-words text-lg font-semibold leading-tight text-content-primary sm:text-xl">
        {skill.name}
      </h4>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-outline-default bg-surface px-2.5 py-1 text-xs font-medium text-content-strong">
          {kindLabel}
        </span>
        <span className="text-xs text-content-muted">
          {content.roleLabel}: <bdi dir="auto" className="font-medium text-content-secondary">{domainTitle}</bdi>
        </span>
      </div>

      <div className="mt-5 border-t border-outline-subtle pt-4">
        <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-content-secondary">{content.projectEvidenceLabel}</h5>
        {skill.projectEvidence.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {skill.projectEvidence.slice(0, 3).map((evidence) => (
              <li key={evidence.slug} className="space-y-1.5">
                <p className="text-[0.68rem] text-content-muted">{content.projectStackEvidenceLabel}</p>
                <Link
                  href={evidence.href}
                  className="inline-flex min-h-9 items-center rounded-sm text-sm font-medium text-accent-soft underline decoration-accent/40 underline-offset-4 transition-colors hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {evidence.title}
                </Link>
                {evidence.workflowSteps.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[0.68rem] text-content-muted">{content.workflowStepEvidenceLabel}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {evidence.workflowSteps.slice(0, 2).map((step) => (
                        <li key={step} className="rounded-md bg-surface px-2 py-1 text-xs leading-snug text-content-secondary">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-content-secondary">{content.noProjectEvidence}</p>
        )}
      </div>
    </aside>
  );
}

export default function TechnicalArsenalExplorer({
  locale,
  content,
  domains,
}: TechnicalArsenalExplorerProps) {
  const shouldReduceMotion = useReducedMotion();
  const domainById = useMemo(() => new Map(domains.map((domain) => [domain.id, domain])), [domains]);
  const [activeDomainId, setActiveDomainId] = useState<SkillDomainId>("backend-engineering");
  const [selectedSkillId, setSelectedSkillId] = useState(
    domainById.get("backend-engineering")?.defaultSkillId ?? "spring-boot",
  );
  const [identityFocus, setIdentityFocus] = useState<IdentityId | null>(null);
  const [domainMotionReady, setDomainMotionReady] = useState(false);
  const activeDomain = domainById.get(activeDomainId) ?? domains[0];
  const selectedSkill = activeDomain.skills.find((skill) => skill.id === selectedSkillId)
    ?? activeDomain.skills.find((skill) => skill.id === activeDomain.defaultSkillId)
    ?? activeDomain.skills[0];
  const identitySelectionText = content.activeDomainAnnouncement.replace("{domain}", activeDomain.title);

  const selectDomain = (domain: TechnicalArsenalDomain) => {
    setDomainMotionReady(true);
    setActiveDomainId(domain.id);
    setSelectedSkillId((currentId) => domain.skills.some((skill) => skill.id === currentId)
      ? currentId
      : domain.defaultSkillId);
    setIdentityFocus(null);
  };

  const selectIdentity = (identity: IdentityId) => {
    setDomainMotionReady(true);
    const nextIdentity = identityFocus === identity ? null : identity;
    setIdentityFocus(nextIdentity);
    if (nextIdentity) {
      const primaryDomainId = identityDomains[nextIdentity][0];
      const primaryDomain = domainById.get(primaryDomainId);
      if (primaryDomain) {
        setActiveDomainId(primaryDomain.id);
        setSelectedSkillId(primaryDomain.defaultSkillId);
      }
    }
  };

  const selectTechnology = (skillId: string) => setSelectedSkillId(skillId);
  const activeIcon = domainIcons[activeDomain.id];
  const ActiveIcon = activeIcon;

  return (
    <section
      id="skills"
      aria-labelledby="technical-arsenal-heading"
      className="relative scroll-mt-24 px-5 py-20 text-content-primary sm:px-8 md:px-10 md:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-72 max-w-5xl rounded-full bg-glow-primary/5 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal className="mb-10 text-center md:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
            {content.ecosystemLabel}
          </p>
          <h2 id="technical-arsenal-heading" className="text-3xl font-bold tracking-tight md:text-5xl">
            {content.titleLead} <span className="text-accent">{content.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-content-secondary md:text-base">
            {content.description}
          </p>
        </Reveal>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)] xl:gap-8">
          <div className="min-w-0 rounded-[1.6rem] border border-outline-subtle bg-surface-elevated/35 p-4 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-5 lg:p-6">
            <div className="mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-content-muted">{content.identityGroupLabel}</h3>
              <p className="mt-1 text-xs leading-relaxed text-content-secondary">{content.identityHint}</p>
            </div>

            <div role="group" aria-label={content.identityGroupLabel} className="grid grid-cols-2 gap-2.5">
              {([
                { id: "developer", title: content.developerTitle, description: content.developerDescription, Icon: Code2 },
                { id: "data-scientist", title: content.dataScientistTitle, description: content.dataScientistDescription, Icon: Activity },
              ] as const).map(({ id, title, description, Icon }) => {
                const isSelected = identityFocus === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectIdentity(id)}
                    className={`group/identity flex min-h-32 min-w-0 flex-col items-start rounded-xl border p-3 text-start transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:p-4 ${isSelected
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-outline-subtle bg-surface/60 hover:border-outline-default hover:bg-surface-elevated/60"
                    }`}
                  >
                    <span className={`mb-2 inline-flex size-8 items-center justify-center rounded-lg border border-outline-subtle bg-surface text-accent-soft transition-transform duration-200 motion-safe:group-hover/identity:-translate-y-0.5 ${isSelected ? "border-accent/50" : ""}`}>
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-sm font-semibold leading-tight text-content-primary">{title}</span>
                    <span className="mt-1.5 text-[0.68rem] leading-relaxed text-content-secondary sm:text-xs">{description}</span>
                  </button>
                );
              })}
            </div>

            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-default/70 to-transparent" />
              <span className="size-1 rounded-full bg-accent" />
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-default/70 to-transparent" />
            </div>

            <div className="rounded-2xl border border-outline-subtle bg-surface/45 px-3 pb-3 pt-4 sm:px-4">
              <TechnicalCore
                domainId={activeDomain.id}
                domainTitle={activeDomain.title}
                coreLabel={content.coreLabel}
                activeDomainLabel={content.activeDomainLabel}
                accentToken={activeDomain.accentToken}
              />
            </div>

            <div className="mb-3 mt-5 flex items-end justify-between gap-3">
              <h3 id="technical-domain-selector-heading" className="text-xs font-semibold uppercase tracking-[0.15em] text-content-muted">
                {content.domainSelectorLabel}
              </h3>
              <span aria-hidden="true" className="h-px flex-1 bg-outline-subtle/75" />
            </div>

            <div role="group" aria-labelledby="technical-domain-selector-heading" className="grid grid-cols-2 gap-2.5">
              {skillDomainIds.map((domainId) => {
                const domain = domainById.get(domainId);
                if (!domain) return null;
                const Icon = domainIcons[domainId];
                const isSelected = activeDomain.id === domainId;
                const isIdentityRelated = identityFocus != null && identityDomains[identityFocus].includes(domainId);

                return (
                  <button
                    key={domainId}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectDomain(domain)}
                    className={`relative flex min-h-[5.5rem] min-w-0 flex-col items-start justify-between gap-2 rounded-xl border p-3 text-start transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${isSelected
                      ? "border-accent bg-accent/5 shadow-sm"
                      : isIdentityRelated
                        ? "border-accent/55 bg-surface/70"
                        : "border-outline-subtle bg-surface/60 hover:border-outline-default"
                    }`}
                  >
                    <span className="flex w-full items-start justify-between gap-2">
                      <Icon aria-hidden="true" className="size-4 shrink-0" style={{ color: `var(${domain.accentToken})` }} />
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wide text-accent-soft">
                          <Check aria-hidden="true" className="size-3" /> {content.selectedLabel}
                        </span>
                      ) : isIdentityRelated ? (
                        <span className="rounded-full border border-outline-subtle px-1.5 py-0.5 text-[0.58rem] font-medium text-content-muted">
                          {content.relatedDomainLabel}
                        </span>
                      ) : null}
                    </span>
                    <span>
                      <span className="block text-xs font-semibold leading-snug text-content-primary sm:text-sm">{domain.title}</span>
                      <span className="mt-1 block text-[0.62rem] leading-snug text-content-muted">{domain.descriptor}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.section
            data-chat-safe-zone
            data-chat-desktop-safe-zone
            data-back-to-top-safe-zone
            aria-labelledby="engineering-panel-heading"
            layout
            transition={{ layout: { duration: shouldReduceMotion ? 0 : 0.22 } }}
            className="min-w-0 rounded-[1.6rem] border border-outline-subtle bg-surface-elevated/60 p-4 shadow-xl shadow-black/5 backdrop-blur-md sm:p-5 lg:p-6"
          >
            <div className="mb-5 flex items-start gap-3 border-b border-outline-subtle pb-4 sm:mb-6 sm:pb-5">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-outline-default bg-surface" style={{ color: `var(${activeDomain.accentToken})` }}>
                <ActiveIcon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-content-muted">{content.panelLabel}</p>
                <motion.h3
                  key={activeDomain.id}
                  id="engineering-panel-heading"
                  initial={domainMotionReady && !shouldReduceMotion ? { opacity: 0, y: 5 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                  className="mt-1 text-xl font-bold leading-tight text-content-primary sm:text-2xl"
                >
                  {activeDomain.title}
                </motion.h3>
                <p className="mt-1 text-sm leading-relaxed text-content-secondary">{activeDomain.description}</p>
              </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(14rem,0.75fr)]">
              <section aria-labelledby="technology-collection-heading" className="min-w-0">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <h4 id="technology-collection-heading" className="text-xs font-semibold uppercase tracking-[0.13em] text-content-secondary">
                    {content.technologyListLabel}
                  </h4>
                  <span dir="ltr" className="text-xs tabular-nums text-content-muted">
                    {new Intl.NumberFormat(localeConfig[locale].intlLocale).format(activeDomain.skills.length)}
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-3">
                  {activeDomain.skills.map((skill, index) => {
                    const isSelected = selectedSkill.id === skill.id;
                    return (
                      <motion.li
                        key={skill.id}
                        initial={domainMotionReady && !shouldReduceMotion ? { opacity: 0, y: 7 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.16, delay: shouldReduceMotion ? 0 : Math.min(index * 0.012, 0.12) }}
                        className="min-w-0"
                      >
                        <button
                          type="button"
                          aria-label={content.selectTechnologyLabel.replace("{technology}", skill.name)}
                          aria-pressed={isSelected}
                          aria-controls="selected-technology-details"
                          onClick={() => selectTechnology(skill.id)}
                          className={`flex min-h-[3.65rem] w-full min-w-0 items-center gap-2 rounded-lg border px-2 py-2 text-start transition-[border-color,background-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:gap-2.5 sm:px-2.5 ${isSelected
                            ? "border-accent bg-accent/5 shadow-sm"
                            : "border-outline-subtle bg-surface/65 hover:border-outline-default hover:bg-surface"
                          }`}
                        >
                          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-elevated/75">
                            <Image
                              src={skill.iconUrl}
                              alt=""
                              aria-hidden="true"
                              width={25}
                              height={25}
                              loading="lazy"
                              unoptimized
                              className="size-[25px] object-contain"
                            />
                          </span>
                          <span className="min-w-0 flex-1 break-words text-[0.68rem] font-medium leading-snug text-content-strong sm:text-xs">
                            {skill.name}
                          </span>
                          {isSelected && <Check aria-hidden="true" className="size-3.5 shrink-0 text-accent-soft" />}
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </section>

              <TechnologyDetails
                skill={selectedSkill}
                content={content}
                domainTitle={activeDomain.title}
              />
            </div>

            <div className="mt-6 space-y-5 border-t border-outline-subtle pt-5 sm:mt-7 sm:pt-6">
              {activeDomain.relatedProject.workflow ? (
                <TechnicalWorkflow
                  workflow={activeDomain.relatedProject.workflow}
                  projectTitle={activeDomain.relatedProject.title}
                  title={content.workflowTitle}
                  directionLabel={content.workflowDirectionLabel}
                  selectedSkillId={selectedSkill.id}
                  locale={locale}
                  selectTechnologyLabel={content.selectTechnologyLabel}
                  onSelectSkill={selectTechnology}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-outline-default bg-surface/40 p-4 text-sm leading-relaxed text-content-secondary">
                  {content.workflowUnavailable}
                </div>
              )}

              <RelatedProjectPreview
                project={activeDomain.relatedProject}
                title={content.relatedProjectLabel}
                technologiesLabel={content.projectTechnologiesLabel}
                viewCaseStudy={content.viewCaseStudy}
                locale={locale}
              />
            </div>
          </motion.section>
        </div>

        <p role="status" className="sr-only" aria-live="polite" aria-atomic="true">
          {identitySelectionText}
        </p>
      </div>
    </section>
  );
}
