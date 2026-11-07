import { certificationKnowledge, type Certification, type CertificationKnowledge } from "@/data/certifications";
import { formatLocalizedDate } from "@/i18n/helpers";
import type { Locale } from "@/i18n/config";

export type CertificationDomain = CertificationKnowledge["domain"];
export type CertificationSortOrder = "newest" | "oldest";
export type CertificationFilter = "all" | CertificationDomain;

interface CertificationDateParts {
  year: number;
  month?: number;
  day?: number;
  precision: 1 | 2 | 3;
}

/** Display order follows the technical story in the portfolio; absent domains are omitted. */
export const certificationDomainOrder: readonly CertificationDomain[] = [
  "software-engineering",
  "backend-java",
  "data-science",
  "machine-learning",
];

export function getCertificationDomain(id: string): CertificationDomain | null {
  return certificationKnowledge[id]?.domain ?? null;
}

export function getAvailableCertificationDomains(
  certifications: readonly Certification[],
): CertificationDomain[] {
  const available = new Set(
    certifications
      .map((certification) => getCertificationDomain(certification.id))
      .filter((domain): domain is CertificationDomain => domain !== null),
  );

  return certificationDomainOrder.filter((domain) => available.has(domain));
}

export function getCertificationDateParts(certification: Certification): CertificationDateParts | null {
  const value = certification.dateISO;
  if (!value) return null;

  const yearOnly = /^(\d{4})$/.exec(value);
  if (yearOnly) {
    const year = Number(yearOnly[1]);
    return year > 0 ? { year, precision: 1 } : null;
  }

  const monthYear = /^(\d{4})-(\d{2})$/.exec(value);
  if (monthYear) {
    const year = Number(monthYear[1]);
    const month = Number(monthYear[2]);
    return year > 0 && month >= 1 && month <= 12
      ? { year, month, precision: 2 }
      : null;
  }

  const fullDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!fullDate) return null;
  const year = Number(fullDate[1]);
  const month = Number(fullDate[2]);
  const day = Number(fullDate[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day, precision: 3 };
}

export function formatCertificationDate(certification: Certification, locale: Locale): string | undefined {
  const parts = getCertificationDateParts(certification);
  if (!parts) {
    return certification.date ? formatLocalizedDate(certification.date, locale) : undefined;
  }

  if (parts.precision === 3) return formatLocalizedDate(certification.dateISO!, locale);

  const value = new Date(Date.UTC(parts.year, (parts.month ?? 1) - 1, 1));
  return parts.precision === 2
    ? formatLocalizedDate(value, locale, { year: "numeric", month: "long", timeZone: "UTC" })
    : formatLocalizedDate(value, locale, { year: "numeric", timeZone: "UTC" });
}

export function sortCertificationsByDate(
  certifications: readonly Certification[],
  order: CertificationSortOrder,
): Certification[] {
  return certifications
    .map((certification, originalIndex) => ({
      certification,
      originalIndex,
      date: getCertificationDateParts(certification),
    }))
    .sort((left, right) => {
      if (!left.date && right.date) return 1;
      if (left.date && !right.date) return -1;

      if (left.date && right.date) {
        const direction = order === "newest" ? -1 : 1;
        if (left.date.year !== right.date.year) return direction * (left.date.year - right.date.year);

        if (left.date.month !== right.date.month) {
          if (left.date.month === undefined) return 1;
          if (right.date.month === undefined) return -1;
          return direction * (left.date.month - right.date.month);
        }

        if (left.date.day !== right.date.day) {
          if (left.date.day === undefined) return 1;
          if (right.date.day === undefined) return -1;
          return direction * (left.date.day - right.date.day);
        }
      }

      return left.originalIndex - right.originalIndex;
    })
    .map(({ certification }) => certification);
}

export function deriveCertificationStatistics(certifications: readonly Certification[]) {
  const domains = new Set<CertificationDomain>();
  const issuers = new Set<string>();
  let mostRecentYear: number | null = null;

  for (const certification of certifications) {
    const domain = getCertificationDomain(certification.id);
    if (domain) domains.add(domain);
    if (certification.issuer.trim()) issuers.add(certification.issuer.trim());

    const date = getCertificationDateParts(certification);
    if (date) {
      mostRecentYear = mostRecentYear === null ? date.year : Math.max(mostRecentYear, date.year);
    }
  }

  return {
    total: certifications.length,
    domains: domains.size,
    issuers: issuers.size,
    mostRecentYear,
  };
}
