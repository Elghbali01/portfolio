import { certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { featuredProjects, projects } from "@/data/projects";
import { aiSkills, dataSkills, devSkills } from "@/data/skills";
import { resolveResources } from "./resources";
import type { ChatLanguage, ChatResponse } from "./types";

export type LocalIntent =
  | "GREETING" | "CV" | "CERTIFICATIONS" | "PROJECTS" | "SKILLS"
  | "GITHUB" | "LINKEDIN" | "CONTACT" | "LANGUAGE_SWITCH" | "BACCALAUREATE";

const phrase = (language: ChatLanguage, values: Record<ChatLanguage, string>) => values[language];

function base(answer: string, language: ChatLanguage, resourceIds: string[] = []): ChatResponse {
  return { answer, language, resources: resolveResources(resourceIds) };
}

export function createLocalResponse(
  intent: LocalIntent,
  language: ChatLanguage,
  options: { all?: boolean; detailed?: boolean } = {},
): ChatResponse {
  if (intent === "LANGUAGE_SWITCH") {
    const response = base(phrase(language, {
      en: "Of course! I’ll continue in English. What would you like to know about Issam?",
      fr: "Bien sûr ! Je continuerai en français. Que souhaitez-vous savoir sur Issam ?",
      ar: "بالتأكيد! سأواصل الحديث بالعربية. ماذا تريد أن تعرف عن عصام؟",
      darija: "أكيد خويا 👌 غادي نكمل معاك بالدارجة. شنو بغيتي تعرف على Issam؟",
    }), language);
    return { ...response, languagePreference: language };
  }

  if (intent === "GREETING") return base(phrase(language, {
    en: "Hi 👋 I’m Issam’s portfolio assistant. What would you like to know about his profile?",
    fr: "Bonjour 👋 Je suis l’assistant du portfolio d’Issam. Que souhaitez-vous savoir sur son profil ?",
    ar: "مرحباً 👋 أنا مساعد ملف عصام المهني. ماذا تريد أن تعرف عن ملفه؟",
    darija: "Salam 👋 Ana Issam Assistant. Chno bghiti t3ref 3la profil dyalo?",
  }), language);

  if (intent === "BACCALAUREATE") return base(phrase(language, {
    en: "Issam’s baccalaureate year is not currently documented in the portfolio or his public CV.",
    fr: "L’année d’obtention du baccalauréat d’Issam n’est actuellement documentée ni dans le portfolio ni dans son CV public.",
    ar: "سنة حصول عصام على شهادة البكالوريا غير موثقة حالياً في ملفه المهني أو سيرته الذاتية العامة.",
    darija: "العام اللي خدا فيه Issam الباك ما موثقش دابا لا فالـ portfolio لا فالـ CV العمومي ديالو.",
  }), language);

  if (intent === "CV") return base(phrase(language, {
    en: "Of course! Here is Issam’s CV.", fr: "Bien sûr ! Voici le CV d’Issam.",
    ar: "بالتأكيد! إليك السيرة الذاتية لعصام.", darija: "أكيد، ها هو الـ CV ديال Issam.",
  }), language, ["profile:cv"]);

  if (intent === "GITHUB") return base(phrase(language, {
    en: "Here is Issam’s verified GitHub profile.", fr: "Voici le profil GitHub vérifié d’Issam.",
    ar: "إليك حساب عصام الموثق على GitHub.", darija: "ها هو GitHub الرسمي ديال Issam.",
  }), language, ["profile:github"]);

  if (intent === "LINKEDIN") return base(phrase(language, {
    en: "Here is Issam’s LinkedIn profile.", fr: "Voici le profil LinkedIn d’Issam.",
    ar: "إليك حساب عصام على LinkedIn.", darija: "ها هو LinkedIn ديال Issam.",
  }), language, ["profile:linkedin"]);

  if (intent === "CONTACT") return base(phrase(language, {
    en: `You can contact Issam at ${profile.contact.email}, or through LinkedIn.`,
    fr: `Vous pouvez contacter Issam à ${profile.contact.email}, ou via LinkedIn.`,
    ar: `يمكنك التواصل مع عصام عبر ${profile.contact.email} أو من خلال LinkedIn.`,
    darija: `تقدر تواصل مع Issam فـ ${profile.contact.email} ولا عبر LinkedIn.`,
  }), language, ["profile:linkedin"]);

  if (intent === "CERTIFICATIONS") {
    const list = certifications.map((cert) => `• ${cert.title} — ${cert.issuer}${cert.date ? ` (${cert.date})` : ""}`).join("\n");
    const intro = phrase(language, {
      en: `Issam has ${certifications.length} documented certifications:`,
      fr: `Issam possède ${certifications.length} certifications documentées :`,
      ar: `لدى عصام ${certifications.length} شهادات موثقة:`,
      darija: `Issam عندو ${certifications.length} ديال الشهادات موثقين فالـ portfolio:`,
    });
    return base(`${intro}\n\n${list}`, language, certifications.slice(0, 4).map((cert) => `certificate:${cert.id}`));
  }

  if (intent === "PROJECTS") {
    const selected = options.all ? projects : featuredProjects.slice(0, 6);
    const list = selected.map((project) => `• ${project.title} — ${project.shortDescription}`).join("\n");
    const intro = phrase(language, {
      en: options.all ? "Here are Issam’s documented projects:" : "Here are Issam’s main portfolio projects:",
      fr: options.all ? "Voici les projets documentés d’Issam :" : "Voici les principaux projets du portfolio d’Issam :",
      ar: options.all ? "إليك مشاريع عصام الموثقة:" : "إليك أبرز مشاريع عصام:",
      darija: options.all ? "هادو هما المشاريع الموثقين ديال Issam:" : "هادو هما أهم المشاريع ديال Issam:",
    });
    return base(`${intro}\n\n${list}`, language, selected.slice(0, 4).map((project) => `project:${project.slug}`));
  }

  const mainSkills = {
    Backend: ["Java", "Spring Boot", "Spring Security", "REST API", "PostgreSQL"],
    "Data Science": ["Python", "Pandas", "Scikit-Learn"],
    "AI / Machine Learning": ["Machine Learning", "Deep Learning"],
  };
  const all = {
    Development: devSkills.map(({ name }) => name),
    "Data Science": dataSkills.map(({ name }) => name),
    "AI / Machine Learning": aiSkills.map(({ name }) => name),
  };
  const groups = options.all ? all : mainSkills;
  const list = Object.entries(groups).map(([group, skills]) => `• ${group}: ${skills.join(", ")}`).join("\n");
  return base(`${phrase(language, {
    en: options.all ? "Here are Issam’s documented skills:" : "Issam’s main skills are grouped as follows:",
    fr: options.all ? "Voici les compétences documentées d’Issam :" : "Les principales compétences d’Issam sont :",
    ar: options.all ? "إليك مهارات عصام الموثقة:" : "أهم مهارات عصام هي:",
    darija: options.all ? "هادو هما الـ skills الموثقين ديال Issam:" : "أهم skills ديال Issam مجموعين هكا:",
  })}\n\n${list}`, language);
}
