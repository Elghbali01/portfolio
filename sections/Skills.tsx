import TechnicalArsenalExplorer from "@/components/technical-arsenal/TechnicalArsenalExplorer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getTechnicalArsenalDomains } from "@/lib/technical-arsenal";

interface SkillsProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function Skills({ locale, dictionary }: SkillsProps) {
  const domains = getTechnicalArsenalDomains(dictionary, locale);

  return (
    <TechnicalArsenalExplorer
      locale={locale}
      content={dictionary.skills}
      domains={domains}
    />
  );
}
