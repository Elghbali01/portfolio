import Image from "next/image";
import Link from "next/link";
import DirectionalArrow from "@/components/DirectionalArrow";
import type { Locale } from "@/i18n/config";
import type { TechnicalArsenalProject } from "@/lib/technical-arsenal";

interface RelatedProjectPreviewProps {
  project: TechnicalArsenalProject;
  title: string;
  technologiesLabel: string;
  viewCaseStudy: string;
  locale: Locale;
}

export default function RelatedProjectPreview({
  project,
  title,
  technologiesLabel,
  viewCaseStudy,
  locale,
}: RelatedProjectPreviewProps) {
  const visibleTechnologies = project.technologies.slice(0, 4);
  const remainingTechnologies = project.technologies.slice(visibleTechnologies.length);

  return (
    <section aria-labelledby="related-project-heading" className="overflow-hidden rounded-2xl border border-outline-subtle bg-surface-elevated/50">
      <div className="grid min-w-0 sm:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="relative aspect-[16/9] min-w-0 bg-surface-inset sm:aspect-auto sm:min-h-[15rem]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            quality={78}
            sizes="(min-width: 640px) 28vw, 100vw"
            className="object-contain"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center p-4 sm:p-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent-soft">{title}</p>
          <p className="mt-2 text-xs font-medium text-content-muted">{project.category}</p>
          <h4 id="related-project-heading" className="mt-1 text-lg font-semibold leading-tight text-content-primary sm:text-xl">
            {project.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-content-secondary">{project.shortDescription}</p>

          {project.technologies.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-content-muted">{technologiesLabel}</p>
              <ul className="flex flex-wrap gap-1.5" aria-label={technologiesLabel}>
                {visibleTechnologies.map((technology) => (
                  <li key={technology} className="rounded-full border border-outline-default bg-surface px-2.5 py-1 text-[0.65rem] text-content-strong">
                    <bdi dir="auto">{technology}</bdi>
                  </li>
                ))}
                {remainingTechnologies.length > 0 && (
                  <li aria-hidden="true" className="rounded-full border border-dashed border-outline-default px-2.5 py-1 text-[0.65rem] text-content-muted">
                    +{remainingTechnologies.length}
                  </li>
                )}
                {remainingTechnologies.length > 0 && (
                  <li className="sr-only">{remainingTechnologies.join(", ")}</li>
                )}
              </ul>
            </div>
          )}

          <div data-chat-safe-zone className="mt-4">
            <Link
              href={project.href}
              className="group/case inline-flex min-h-10 items-center gap-2 rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action transition-[background-color,box-shadow] hover:bg-action-hover hover:shadow-md hover:shadow-glow-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {viewCaseStudy}
              <DirectionalArrow locale={locale} direction="forward" className="size-4 transition-transform duration-200 motion-safe:group-hover/case:translate-x-0.5 rtl:group-hover/case:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
