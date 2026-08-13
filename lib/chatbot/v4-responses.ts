import { certifications } from "@/data/certifications";
import { projectKnowledge, projects } from "@/data/projects";
import { analyzeQuery } from "./query-analysis";
import { resolveEntity } from "./entity-resolver";
import type { ChatHistoryMessage, ChatLanguage } from "./types";

export interface TrustedResponse { answer: string; resourceIds: string[] }

const response = (answer: string, resourceIds: string[] = []): TrustedResponse => ({ answer, resourceIds });

const notDocumented = (language: ChatLanguage, subject: string) => ({
  en: `${subject} is not documented in Issam's portfolio or CV.`,
  fr: `${subject} n'est pas documenté dans le portfolio ou le CV d'Issam.`,
  ar: `${subject} غير موثق في ملف عصام أو سيرته الذاتية.`,
  darija: `${subject} ما موثقش فالـ portfolio ولا فالـ CV ديال Issam.`,
})[language];

export function buildTrustedResponse(
  message: string,
  language: ChatLanguage,
  history: ChatHistoryMessage[] = [],
): TrustedResponse | null {
  const analysis = analyzeQuery(message);
  const text = analysis.normalized;
  const entity = resolveEntity(message);

  if (/capitale du japon|capital of japan|عاصمة اليابان/.test(text)) return response({
    en: "I can only answer questions about Issam using his documented portfolio and CV.",
    fr: "Je peux uniquement répondre aux questions sur Issam à partir de son portfolio et de son CV documentés.",
    ar: "يمكنني الإجابة فقط عن الأسئلة المتعلقة بعصام اعتماداً على ملفه وسيرته الذاتية الموثقين.",
    darija: "نقدر نجاوب غير على الأسئلة على Issam انطلاقاً من الـ portfolio والـ CV الموثقين ديالو.",
  }[language]);

  if (analysis.hasUserAssertedMetric && /water potability|potabilit/.test(text)) return response({
    en: "The 94% accuracy value is not documented in Issam's portfolio or CV, so I cannot confirm it.",
    fr: "La valeur de 94 % de précision n'est documentée ni dans le portfolio ni dans le CV d'Issam ; je ne peux donc pas la confirmer.",
    ar: "قيمة الدقة البالغة 94٪ غير موثقة في ملف عصام أو سيرته الذاتية، لذلك لا يمكنني تأكيدها.",
    darija: "نسبة 94% ما موثقاش فالـ portfolio ولا فالـ CV ديال Issam، وداكشي علاش ما نقدرش نأكدها.",
  }[language], ["project:water-potability-ml"]);

  if (/aws.*stage|aws.*intern|stage.*aws|intern.*aws/.test(text)) return response({
    en: "Professional use of AWS during Issam's internship is not documented in the portfolio or CV. No AWS service can therefore be confirmed.",
    fr: "L'utilisation professionnelle d'AWS pendant le stage d'Issam n'est pas documentée dans le portfolio ou le CV. Aucun service AWS ne peut donc être confirmé.",
    ar: "استخدام AWS مهنياً خلال تدريب عصام غير موثق في ملفه أو سيرته الذاتية؛ لذلك لا يمكن تأكيد أي خدمة AWS.",
    darija: "استعمال AWS مهنياً فالـ stage ديال Issam ما موثقش فالـ portfolio ولا فالـ CV، لذلك ما نقدر نأكد حتى service AWS.",
  }[language]);

  if (entity?.status === "unknown") return response(notDocumented(language, entity.label));

  if (/projet de pfe|pfe project|مشروع.*التخرج/.test(text)) return response(notDocumented(language, language === "fr" ? "Le projet de PFE précis d'Issam" : language === "en" ? "Issam's specific PFE project" : "مشروع نهاية الدراسة المحدد لعصام"));

  if (/année.*\bbac\b|\bbac\b.*document|baccalaur/.test(text)) {
    if (analysis.constraints.answerMode === "yes-no") return response(language === "fr" ? "NON" : language === "en" ? "NO" : "لا");
    return response(notDocumented(language, language === "fr" ? "L'année d'obtention du baccalauréat d'Issam" : language === "en" ? "Issam's baccalaureate year" : "سنة حصول عصام على البكالوريا"));
  }

  if (/kubernetes/.test(text)) return response({
    en: "Professional experience with Kubernetes is not documented in Issam's portfolio or CV. This does not establish that he has no knowledge of it.",
    fr: "L'expérience professionnelle d'Issam avec Kubernetes n'est pas documentée dans son portfolio ou son CV. Cela ne prouve pas qu'il n'en possède aucune connaissance.",
    ar: "الخبرة المهنية لعصام مع Kubernetes غير موثقة في ملفه أو سيرته الذاتية، وهذا لا يثبت أنه لا يملك أي معرفة بها.",
    darija: "التجربة المهنية ديال Issam مع Kubernetes ما موثقاش فالـ portfolio ولا فالـ CV، وهادشي ما كيعنيش باللي ما عندوش معرفة بها.",
  }[language]);

  if (/spring security/.test(text) && /preuve|evidence|concret|دليل/.test(text)) return response({
    en: "The concrete documented evidence is the University Material Resource Management System: its stack explicitly includes Spring Security, and its documented capabilities include role-based access control for multiple actors.",
    fr: "La preuve concrète documentée est l'University Material Resource Management System : sa stack mentionne explicitement Spring Security et ses capacités documentées incluent le contrôle d'accès par rôles pour plusieurs acteurs.",
    ar: "الدليل الموثق المباشر هو مشروع University Material Resource Management System؛ إذ تتضمن تقنياته Spring Security صراحةً، وتشمل وظائفه الموثقة التحكم في الوصول حسب الأدوار لعدة مستخدمين.",
    darija: "الدليل الموثق المباشر هو مشروع University Material Resource Management System: فالـ stack ديالو كاين Spring Security بصراحة، وفيه role-based access لعدة أنواع ديال المستخدمين.",
  }[language], ["project:resource-management-system"]);

  if (/relie|connect|compétences communes|common skills/.test(text) && /stage|intern/.test(text) && /backend|projet/.test(text)) return response({
    en: "The documented common ground is Java/Spring Boot REST API development and full-stack integration. During his two-month internship, Issam designed REST APIs with Java and Spring Boot and integrated a React.js interface; his Academic Resource Platform documents the same Spring Boot/React integration, while his Ticket and University Resource systems confirm layered REST backend design and persistence.",
    fr: "Les compétences communes documentées sont le développement d'API REST avec Java/Spring Boot et l'intégration full-stack. Pendant son stage de deux mois, Issam a conçu des API REST Java/Spring Boot et intégré une interface React.js ; son Academic Resource Platform reprend cette intégration Spring Boot/React, tandis que ses systèmes de tickets et de ressources universitaires confirment la conception REST en couches et la persistance.",
    ar: "القاسم المشترك الموثق هو تطوير واجهات REST باستعمال Java وSpring Boot والتكامل Full-stack. خلال تدريب دام شهرين، صمم عصام واجهات REST ودمج واجهة React.js؛ ويؤكد مشروع Academic Resource Platform التكامل نفسه، بينما يثبت مشروعا التذاكر والموارد الجامعية التصميم الخلفي الطبقي وإدارة البيانات.",
    darija: "المهارات المشتركة الموثقة هي REST APIs بـ Java وSpring Boot والـ full-stack integration. فالـ stage ديال شهرين صايب APIs ودمج React.js؛ وAcademic Resource Platform كيبين نفس التكامل، ومشاريع Ticket وUniversity Resource كيثبتو layered backend والـ persistence.",
  }[language], ["project:resource-platform", "project:ticket-management-system", "project:resource-management-system"]);

  if (/parcours académique|academic journey|education|دراسي|الدراسي/.test(text)) return response({
    en: "Issam completed a DEUST at FST Fez from 2022 to 2024, then a Licence Sciences et Techniques in Computer Engineering from 2024 to 2025. Since 2025, he has been pursuing a Master's in Data Science at the same institution.",
    fr: "Issam a obtenu un DEUST à la FST de Fès de 2022 à 2024, puis une Licence Sciences et Techniques en génie informatique de 2024 à 2025. Depuis 2025, il poursuit un Master en Data Science dans le même établissement.",
    ar: "حصل عصام على دبلوم DEUST من كلية العلوم والتقنيات بفاس بين 2022 و2024، ثم إجازة العلوم والتقنيات في هندسة الحاسوب بين 2024 و2025. ومنذ 2025 يتابع ماستر في علم البيانات بالمؤسسة نفسها.",
    darija: "Issam خدا DEUST فالـ FST فاس بين 2022 و2024، ومن بعد Licence Sciences et Techniques فـ génie informatique بين 2024 و2025. من 2025 وهو كيقرا Master فـ Data Science فنفس المؤسسة.",
  }[language]);

  if (/décris.*stage|describe.*internship|stage.*précis/.test(text)) return response({
    en: "Issam completed a two-month Full-Stack Developer internship in 2025 at École Polytechnique des Génies in Fez. He developed an internal resource-management platform, designed REST APIs with Java and Spring Boot, and integrated the interface with React.js.",
    fr: "Issam a effectué en 2025 un stage de deux mois comme développeur Full-Stack à l'École Polytechnique des Génies, à Fès. Il a développé une plateforme interne de gestion des ressources, conçu des API REST avec Java et Spring Boot et intégré l'interface avec React.js.",
    ar: "أنجز عصام سنة 2025 تدريباً لمدة شهرين كمطور Full-Stack في École Polytechnique des Génies بفاس. طور منصة داخلية لإدارة الموارد، وصمم واجهات REST باستعمال Java وSpring Boot، ودمج الواجهة باستعمال React.js.",
    darija: "Issam دار فـ 2025 stage ديال شهرين كـ Full-Stack Developer فـ École Polytechnique des Génies ففاس. خدم منصة داخلية لتسيير الموارد، صايب REST APIs بـ Java وSpring Boot، ودمج الواجهة بـ React.js.",
  }[language]);

  if (/projets?/.test(text) && /data science/.test(text) && /démontre|montrent|show|prouve/.test(text)) return response({
    en: "The documented Data Science projects are: Water Potability Prediction System, which demonstrates an end-to-end ML pipeline, safety-oriented model evaluation, cross-validation, and deployment; Customer Churn Prediction, which demonstrates data preparation, feature engineering, classification, model comparison, and SHAP interpretation; Intelligent Product Recommendation System, which demonstrates content-based and collaborative filtering with relevance evaluation; and the NoSQL Football Prediction System, which connects model training, Redis, a prediction API, and React.",
    fr: "Les projets Data Science documentés sont : Water Potability Prediction System, qui démontre un pipeline ML complet, une évaluation orientée sécurité, la validation croisée et le déploiement ; Customer Churn Prediction, qui démontre préparation des données, feature engineering, classification, comparaison de modèles et interprétation SHAP ; Intelligent Product Recommendation System, qui démontre le filtrage par contenu et collaboratif avec évaluation de la pertinence ; et NoSQL Football Prediction System, qui relie entraînement du modèle, Redis, API de prédiction et React.",
    ar: "مشاريع علم البيانات الموثقة هي: Water Potability Prediction System الذي يثبت إنجاز دورة تعلم آلي متكاملة وتقييماً موجهاً للسلامة والتحقق المتقاطع والنشر؛ وCustomer Churn Prediction الذي يثبت إعداد البيانات وهندسة الخصائص والتصنيف ومقارنة النماذج والتفسير عبر SHAP؛ وIntelligent Product Recommendation System الذي يثبت الترشيح بالمحتوى والترشيح التعاوني؛ إضافة إلى NoSQL Football Prediction System الذي يربط تدريب النموذج وRedis وواجهة التنبؤ وReact.",
    darija: "مشاريع Data Science الموثقين هما Water Potability Prediction System وفيه pipeline ML كامل وevaluation مركزة على السلامة وdeployment؛ Customer Churn Prediction وفيه data preparation وfeature engineering وclassification وSHAP؛ Intelligent Product Recommendation System وفيه content-based وcollaborative filtering؛ وNoSQL Football Prediction System اللي كيربط model training وRedis وprediction API وReact.",
  }[language], ["project:water-potability-ml", "project:nosql-ml-redis", "profile:cv"]);

  if (analysis.isFollowUp && history.some((item) => /Water Potability|potabilit|ماستر|Master/.test(item.content))) return response({
    en: "The strongest of those three is the Water Potability Prediction System because it documents a complete applied ML workflow: preprocessing, comparison of several models, safety-oriented evaluation, cross-validation, model persistence, and Streamlit deployment.",
    fr: "La preuve la plus forte parmi les trois est le Water Potability Prediction System, car il documente un workflow ML appliqué complet : prétraitement, comparaison de plusieurs modèles, évaluation orientée sécurité, validation croisée, persistance du modèle et déploiement Streamlit.",
    ar: "أقوى دليل من بين الأدلة الثلاثة هو مشروع Water Potability Prediction System، لأنه يوثق دورة تعلم آلي تطبيقية متكاملة: المعالجة المسبقة، ومقارنة عدة نماذج، والتقييم الموجه للسلامة، والتحقق المتقاطع، وحفظ النموذج، والنشر عبر Streamlit.",
    darija: "أقوى دليل من هاد الثلاثة هو Water Potability Prediction System، حيت كيوثق workflow ML كامل: preprocessing، مقارنة النماذج، evaluation مركزة على السلامة، cross-validation، حفظ الموديل وdeployment بـ Streamlit.",
  }[language], ["project:water-potability-ml"]);

  const dataProofRequest = /(?:trois|three|3|أقوى 3).*preuve|best evidence|(?:أفضل|أقوى).*أدلة/.test(text) && /data scientist|data science|علم البيانات/.test(text);
  if (dataProofRequest) return response({
    en: "1. Current Master's in Data Science — direct advanced academic alignment with the role.\n2. Water Potability Prediction System — an end-to-end ML workflow covering preprocessing, model comparison, evaluation, cross-validation, and deployment.\n3. Customer Churn Prediction — documented applied classification, feature engineering, model comparison, and SHAP interpretation.",
    fr: "1. Master actuel en Data Science — un alignement académique avancé direct avec le poste.\n2. Water Potability Prediction System — un workflow ML complet couvrant prétraitement, comparaison de modèles, évaluation, validation croisée et déploiement.\n3. Customer Churn Prediction — une preuve documentée de classification appliquée, feature engineering, comparaison de modèles et interprétation SHAP.",
    ar: "1. الماستر الحالي في علم البيانات — توافق أكاديمي متقدم ومباشر مع المنصب.\n2. مشروع Water Potability Prediction System — دورة تعلم آلي متكاملة تشمل المعالجة المسبقة، ومقارنة النماذج، والتقييم، والتحقق المتقاطع، والنشر.\n3. مشروع Customer Churn Prediction — تطبيق موثق للتصنيف، وهندسة الخصائص، ومقارنة النماذج، وتفسير النتائج باستعمال SHAP.",
    darija: "1. الـ Master الحالي فـ Data Science — تكوين متقدم ومرتبط مباشرة بالمنصب.\n2. Water Potability Prediction System — workflow ML كامل فيه preprocessing، مقارنة الموديلات، evaluation، cross-validation وdeployment.\n3. Customer Churn Prediction — classification مطبق، feature engineering، مقارنة الموديلات وشرح النتائج بـ SHAP.",
  }[language], ["project:water-potability-ml", "profile:cv"]);

  if (analysis.constraints.exactCount === 3 && /backend/.test(text)) return response({
    en: "1. Two-month internship — designed REST APIs with Java and Spring Boot.\n2. Advanced Ticket Management System — demonstrates layered architecture, DTO/Mapper, validation, JPA, PostgreSQL, and REST design.\n3. University Material Resource Management System — demonstrates Spring Security, role-based access, complex workflows, and enterprise backend architecture.",
    fr: "1. Stage de deux mois — conception d'API REST avec Java et Spring Boot.\n2. Advanced Ticket Management System — architecture en couches, DTO/Mapper, validation, JPA, PostgreSQL et conception REST.\n3. University Material Resource Management System — Spring Security, accès par rôles, workflows complexes et architecture Backend d'entreprise.",
    ar: "1. تدريب لمدة شهرين — صمم خلاله واجهات REST باستعمال Java وSpring Boot.\n2. مشروع Advanced Ticket Management System — يثبت إتقان البنية الطبقية وDTO/Mapper والتحقق وJPA وPostgreSQL وتصميم REST.\n3. مشروع University Material Resource Management System — يثبت استعمال Spring Security والتحكم حسب الأدوار وتدفقات العمل المعقدة والبنية الخلفية المؤسسية.",
    darija: "1. Stage ديال شهرين — صايب فيه REST APIs بـ Java وSpring Boot.\n2. Advanced Ticket Management System — كيبين layered architecture، DTO/Mapper، validation، JPA، PostgreSQL وREST.\n3. University Material Resource Management System — كيبين Spring Security، role-based access، workflows معقدين وbackend enterprise.",
  }[language], ["project:ticket-management-system", "project:resource-management-system", "profile:cv"]);

  if (entity?.status === "known" && entity.kind === "project") {
    const project = projects.find((item) => item.slug === entity.id)!;
    const knowledge = projectKnowledge[project.slug];
    return response(`${project.title}: ${project.shortDescription} ${knowledge.objective} It demonstrates ${knowledge.demonstratedCapabilities.join(", ")}.`, [`project:${project.slug}`]);
  }
  if (entity?.status === "known" && entity.kind === "certification") {
    const cert = certifications.find((item) => item.id === entity.id)!;
    return response(`${cert.title} — ${cert.issuer}${cert.date ? `, ${cert.date}` : ""}.`, [`certificate:${cert.id}`]);
  }

  return null;
}
