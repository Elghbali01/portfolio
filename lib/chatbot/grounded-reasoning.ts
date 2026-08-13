import { normalizeMessage } from "./language";
import type { ChatLanguage } from "./types";

export interface GroundedReasoning {
  answer: string;
  resourceIds: string[];
}

const byLanguage = (language: ChatLanguage, answers: Record<ChatLanguage, string>) => answers[language];

export function buildGroundedReasoning(message: string, language: ChatLanguage): GroundedReasoning | null {
  const text = normalizeMessage(message);
  const backend = /backend|java|spring/.test(text);
  const dataScience = /data science|data scientist|علم البيانات/.test(text);
  const projects = /project|projet|مشروع|مشاريع/.test(text);
  const certifications = /certif|certificate|شهاد/.test(text);
  const comparison = /between|compar|stronger|plus fort|backend (?:ou|or) data science|choisis|choose|أقوى/.test(text);
  const candidacy = /candidate|candidat|poste|role|profil|مرشح|مناسب/.test(text);

  if (/kubernetes|cyber ?security|cybers[eé]curit[eé]/.test(text)) return {
    answer: byLanguage(language, {
      en: "Professional experience with this technology or domain is not currently documented in Issam’s portfolio. This means the available evidence is insufficient; it does not prove that he has no knowledge of it.",
      fr: "Aucune expérience professionnelle avec cette technologie ou ce domaine n’est actuellement documentée dans le portfolio d’Issam. Les preuves disponibles sont donc insuffisantes ; cela ne démontre pas qu’il n’en possède aucune connaissance.",
      ar: "لا توجد حالياً خبرة مهنية موثقة بهذه التقنية أو بهذا المجال في ملف عصام. لذلك فالأدلة المتاحة غير كافية، وهذا لا يثبت أنه لا يملك أي معرفة به.",
      darija: "ما كايناش دابا تجربة مهنية موثقة بهاد التكنولوجيا ولا المجال فالـ portfolio ديال Issam. يعني الأدلة اللي كاينة ما كافياش، وماشي دليل أنه ما عندوش حتى معرفة بها.",
    }),
    resourceIds: [],
  };

  if (comparison && backend && dataScience) return {
    answer: byLanguage(language, {
      en: "Based only on the portfolio, Issam’s Data Science side is currently stronger overall. His current Master’s degree focuses on Data Science, his public CV documents two additional applied Data Science projects, and the portfolio includes end-to-end ML work such as Water Potability Prediction plus several Data/ML certifications. His Backend profile is nevertheless substantial: he completed a two-month Spring Boot/React internship and built several enterprise Java projects, especially the Ticket Management and Resource Management systems.",
      fr: "D’après les seules preuves du portfolio, le profil Data Science d’Issam est actuellement le plus fort dans l’ensemble. Son Master actuel est centré sur la Data Science, son CV public documente deux projets Data Science supplémentaires, et le portfolio présente un pipeline ML complet sur la potabilité de l’eau ainsi que plusieurs certifications Data/ML. Son profil Backend reste néanmoins solide grâce à un stage de deux mois avec Spring Boot/React et plusieurs projets Java d’entreprise, notamment les systèmes de tickets et de gestion des ressources.",
      ar: "استناداً فقط إلى أدلة الملف المهني، جانب علم البيانات لدى عصام هو الأقوى حالياً بشكل عام. يدرس حالياً ماستر في علم البيانات، وتوثق سيرته الذاتية مشروعين إضافيين في هذا المجال، كما يعرض ملفه مشروعاً متكاملاً للتعلم الآلي حول صلاحية المياه وعدة شهادات في البيانات والتعلم الآلي. ومع ذلك، يظل جانبه الخلفي قوياً بفضل تدريب لمدة شهرين باستعمال Spring Boot وReact ومشاريع Java مؤسساتية متعددة.",
      darija: "حسب غير الأدلة اللي كاينة فالـ portfolio، الجانب ديال Data Science عند Issam باين أقوى دابا فالمجموع. راه كيقرا Master فـ Data Science، والـ CV ديالو موثق جوج مشاريع Data زايدين، وعندو مشروع ML كامل ديال Water Potability مع عدة certifications Data/ML. ومع ذلك، الـ Backend ديالو حتى هو مزيان: دار stage ديال شهرين بـ Spring Boot وReact وخدم على مشاريع Java enterprise بحال Ticket Management وResource Management.",
    }),
    resourceIds: ["project:water-potability-ml", "project:ticket-management-system", "project:resource-management-system"],
  };

  if (projects && backend) return {
    answer: byLanguage(language, {
      en: "The strongest Backend evidence is the Advanced Ticket Management System, the University Material Resource Management System, and the Employee & Salary Management System. The ticket system demonstrates a focused Spring Boot REST API with layered architecture, DTO/Mapper patterns, validation, JPA, and PostgreSQL. The university system adds complex multi-actor workflows, Spring Security, role-based access, and enterprise architecture. The employee system demonstrates three-tier MVC, JDBC/MySQL persistence, CRUD operations, and role-based authentication.",
      fr: "Les meilleures preuves Backend sont l’Advanced Ticket Management System, l’University Material Resource Management System et l’Employee & Salary Management System. Le système de tickets démontre une API REST Spring Boot ciblée, une architecture en couches, les patterns DTO/Mapper, la validation, JPA et PostgreSQL. Le système universitaire ajoute des workflows multi-acteurs complexes, Spring Security, le contrôle d’accès par rôle et une architecture d’entreprise. Le système de gestion des employés démontre une architecture MVC trois tiers, la persistance JDBC/MySQL, les opérations CRUD et l’authentification par rôle.",
      ar: "أقوى الأدلة على مهارات عصام الخلفية هي نظام إدارة التذاكر المتقدم، ونظام إدارة الموارد الجامعية، ونظام إدارة الموظفين والرواتب. يعرض نظام التذاكر API باستخدام Spring Boot مع بنية طبقية وDTO/Mapper والتحقق وJPA وPostgreSQL. ويضيف النظام الجامعي تدفقات عمل معقدة متعددة الأطراف وSpring Security والتحكم حسب الدور. أما نظام الموظفين فيثبت العمل ببنية MVC ثلاثية الطبقات وJDBC وMySQL وعمليات CRUD.",
      darija: "أقوى المشاريع اللي كيبينو Backend ديال Issam هما Advanced Ticket Management System، University Material Resource Management System وEmployee & Salary Management System. مشروع tickets فيه REST API بـ Spring Boot، layered architecture، DTO/Mapper، validation، JPA وPostgreSQL. مشروع الجامعة كيزيد workflows معقدين، Spring Security وrole-based access. ومشروع employees كيبين MVC بثلاث طبقات، JDBC/MySQL، CRUD وauthentication بالأدوار.",
    }),
    resourceIds: ["project:ticket-management-system", "project:resource-management-system", "project:employee-management"],
  };

  if (certifications && dataScience) return {
    answer: byLanguage(language, {
      en: "The most relevant certifications for a Data Science recruiter are Supervised Machine Learning: Regression and Classification, Python for Data Science, AI & Development, CS250: Python for Data Scientists, and Data Visualization. They respectively support core supervised-learning knowledge, practical Python for Data/AI, Python programming aimed at Data Science, and the ability to explore and communicate data visually.",
      fr: "Les certifications les plus pertinentes pour un recruteur Data Science sont Supervised Machine Learning: Regression and Classification, Python for Data Science, AI & Development, CS250: Python for Data Scientists et Data Visualization. Elles attestent respectivement des bases du supervised learning, de Python appliqué à la Data/IA, de la programmation Python orientée Data Science et de la capacité à explorer et communiquer les données visuellement.",
      ar: "أكثر الشهادات صلة بمُجند في علم البيانات هي التعلم الآلي المراقب: الانحدار والتصنيف، وPython لعلم البيانات والذكاء الاصطناعي، وCS250: Python لعلماء البيانات، وتصوير البيانات. فهي تدعم على التوالي أساسيات التعلم المراقب، وPython التطبيقي للبيانات والذكاء الاصطناعي، والبرمجة الموجهة لعلم البيانات، والقدرة على استكشاف البيانات وعرضها بصرياً.",
      darija: "أكثر certifications مناسبين لـ recruiter ديال Data Science هما Supervised Machine Learning، Python for Data Science, AI & Development، CS250 Python for Data Scientists وData Visualization. كيبينو بالترتيب الأساس ديال supervised learning، Python مطبق فالـ Data/AI، البرمجة الموجهة للـ Data Science، والقدرة على تحليل وتوضيح البيانات بالvisualisation.",
    }),
    resourceIds: ["certificate:supervised-ml-regression-classification", "certificate:python-data-science-ai", "certificate:cs250-python-for-data-scientists", "certificate:kaggle-data-visualization"],
  };

  if (candidacy && backend) return {
    answer: byLanguage(language, {
      en: "Issam is a relevant candidate for a junior Java Backend role because the portfolio documents both practical experience and several enterprise-style Spring projects. During a two-month internship, he designed REST APIs with Java and Spring Boot. His Ticket Management project demonstrates layered architecture, DTO/Mapper patterns, validation, JPA, PostgreSQL, and REST design, while the Resource Management project adds Spring Security, role-based access, and complex workflows.",
      fr: "Issam est un candidat pertinent pour un poste junior Backend Java car le portfolio documente à la fois une expérience pratique et plusieurs projets Spring de type entreprise. Pendant un stage de deux mois, il a conçu des API REST avec Java et Spring Boot. Son projet de gestion de tickets démontre l’architecture en couches, les patterns DTO/Mapper, la validation, JPA, PostgreSQL et la conception REST, tandis que le projet de gestion des ressources ajoute Spring Security, le contrôle d’accès par rôle et des workflows complexes.",
      ar: "عصام مرشح مناسب لوظيفة Junior Backend Java لأن ملفه يوثق خبرة عملية وعدة مشاريع مؤسساتية باستعمال Spring. خلال تدريب دام شهرين، صمم واجهات REST باستخدام Java وSpring Boot. ويُظهر مشروع إدارة التذاكر البنية الطبقية وDTO/Mapper والتحقق وJPA وPostgreSQL، بينما يضيف مشروع إدارة الموارد Spring Security والتحكم حسب الدور وتدفقات عمل معقدة.",
      darija: "Issam y9der يكون candidat مزيان لposte junior Backend Java حيت الـ portfolio ديالو كيبين تجربة عملية ومشاريع Spring enterprise. فـ stage ديال شهرين صايب REST APIs بـ Java وSpring Boot. مشروع Ticket Management كيبين layered architecture، DTO/Mapper، validation، JPA وPostgreSQL، ومشروع Resource Management كيزيد Spring Security، role-based access وworkflows معقدين.",
    }),
    resourceIds: ["project:ticket-management-system", "project:resource-management-system"],
  };

  if (candidacy && dataScience) return {
    answer: byLanguage(language, {
      en: "Issam is a credible junior Data Scientist candidate because his current Master’s degree, applied projects, and certifications all align with the role. The portfolio documents end-to-end ML work on water potability, while his public CV adds churn prediction with SHAP and a recommendation system. His documented toolkit includes Python, Pandas, Scikit-learn, model evaluation, feature engineering, and data visualization.",
      fr: "Issam est un candidat crédible pour un poste junior Data Scientist car son Master actuel, ses projets appliqués et ses certifications sont tous alignés avec ce rôle. Le portfolio documente un projet ML complet sur la potabilité de l’eau, tandis que son CV public ajoute une prédiction de churn avec SHAP et un système de recommandation. Ses outils documentés comprennent Python, Pandas, Scikit-learn, l’évaluation de modèles, le feature engineering et la visualisation.",
      ar: "عصام مرشح موثوق لوظيفة Junior Data Scientist لأن الماستر الحالي والمشاريع التطبيقية والشهادات تتوافق مع هذا الدور. يوثق الملف مشروع تعلم آلي متكاملاً حول صلاحية المياه، وتضيف سيرته الذاتية مشروع توقع فقدان العملاء مع SHAP ونظام توصية. وتشمل أدواته الموثقة Python وPandas وScikit-learn وتقييم النماذج وهندسة الخصائص وتصوير البيانات.",
      darija: "Issam candidat مزيان لposte junior Data Scientist حيت الـ Master ديالو، المشاريع التطبيقية وcertifications كاملين مرتبطين بالمجال. عندو مشروع ML كامل على Water Potability، والـ CV كيزيد Churn Prediction بـ SHAP وRecommendation System. والـ tools الموثقين عندو فيهم Python، Pandas، Scikit-learn، model evaluation، feature engineering وdata visualization.",
    }),
    resourceIds: ["project:water-potability-ml", "certificate:supervised-ml-regression-classification", "certificate:python-data-science-ai"],
  };

  return null;
}
