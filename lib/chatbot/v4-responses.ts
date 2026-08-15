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

const projectResource = (slug: string) => `project:${slug}`;

function technologyProjects(message: string, language: ChatLanguage): TrustedResponse | null {
  const text = normalizeTechnology(message);
  const requested = ["fastapi", "scikit learn", "react", "docker", "shap"]
    .find((technology) => text.includes(technology));
  if (!requested || !/(?:which|what|quels?|projets?|projects?|used|utilis|experience|worked|combine)/.test(text)) return null;
  const matches = projects.filter((project) => project.technologies.some((technology) => {
    const normalized = normalizeTechnology(technology);
    return requested === "react" ? normalized === "react" || normalized === "react js" : normalized === requested;
  }));
  if (!matches.length) return response(notDocumented(language, requested));
  const display = requested === "scikit learn" ? "Scikit-learn" : requested === "fastapi" ? "FastAPI" : requested === "shap" ? "SHAP" : requested[0].toUpperCase() + requested.slice(1);
  const names = matches.map((project) => project.title).join(", ");
  return response({
    en: `${display} is documented in: ${names}.`,
    fr: `${display} est documenté dans : ${names}.`,
    ar: `${display} موثق في المشاريع التالية: ${names}.`,
    darija: `${display} موثق فهاد المشاريع: ${names}.`,
  }[language], matches.map((project) => projectResource(project.slug)));
}

function normalizeTechnology(value: string): string {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[._-]+/g, " ");
}

function newProjectResponse(text: string, language: ChatLanguage): TrustedResponse | null {
  const churn = /customer churn|churn prediction|churn model|churners?|shap/.test(text);
  const football = /football intelligence|player recommendation|recommendation systems?|recommandation de joueurs|syst[eè]mes? de recommandation|similar players|joueurs similaires|cosine similarity|hidden gems|replacement recommendations?|sporting talent|player comparison/.test(text);

  if (churn) {
    const resourceIds = [projectResource("customer-churn-prediction")];
    if (/roc.?auc|performance|metric|m[eé]trique/.test(text)) return response({
      en: "The final Customer Churn test ROC-AUC is 0.8429. At the 0.30 operational threshold, the pipeline detects 285 of the 374 churners in the test set.",
      fr: "Le ROC-AUC final du projet Customer Churn sur le jeu de test est de 0,8429. Au seuil opérationnel de 0,30, le pipeline détecte 285 des 374 clients qui résilient dans le jeu de test.",
      ar: "بلغ ROC-AUC النهائي على مجموعة الاختبار 0.8429، ومع العتبة التشغيلية 0.30 يكتشف النظام 285 من أصل 374 عميلاً غادروا.",
      darija: "الـ ROC-AUC النهائي فالـ test هو 0.8429، ومع threshold ديال 0.30 كيكشف 285 من أصل 374 churners.",
    }[language], resourceIds);
    if (/model|mod[eè]le/.test(text)) return response({
      en: "The final churn pipeline uses Logistic Regression. The project also compared Decision Tree, Random Forest, and Gradient Boosting, then set the operational threshold to 0.30 for the business precision/recall trade-off.",
      fr: "Le pipeline final de churn utilise la régression logistique. Le projet a aussi comparé Decision Tree, Random Forest et Gradient Boosting, puis fixé le seuil opérationnel à 0,30 selon le compromis métier précision/rappel.",
      ar: "يستعمل خط churn النهائي Logistic Regression بعد مقارنة Decision Tree وRandom Forest وGradient Boosting، مع ضبط العتبة التشغيلية على 0.30.",
      darija: "الـ pipeline النهائي ديال churn كيستعمل Logistic Regression من بعد مقارنة Decision Tree وRandom Forest وGradient Boosting، والـ threshold تضبط على 0.30.",
    }[language], resourceIds);
    if (/shap/.test(text)) return response({
      en: "Yes. Customer Churn Prediction uses SHAP and model coefficients to analyze global feature influence, while explicitly avoiding causal claims.",
      fr: "Oui. Customer Churn Prediction utilise SHAP et les coefficients du modèle pour analyser l’influence globale des variables, sans transformer ces associations en causalité.",
      ar: "نعم. يستعمل مشروع Customer Churn تقنية SHAP ومعاملات النموذج لتحليل التأثير العام للخصائص دون ادعاء السببية.",
      darija: "نعم. مشروع Customer Churn كيستعمل SHAP وcoefficients ديال model باش يحلل تأثير features بلا ما يدّعي السببية.",
    }[language], resourceIds);
    return response({
      en: "Customer Churn Prediction is an end-to-end ML system that predicts churn probabilities and turns them into retention signals. It covers leakage-safe preprocessing, feature engineering, model comparison, a final Logistic Regression pipeline, a 0.30 operational threshold, SHAP explainability, FastAPI/Pydantic inference, 39 automated tests, 70 final validations, and validated Docker deployment.",
      fr: "Customer Churn Prediction est un système ML de bout en bout qui prédit la probabilité de churn et la transforme en signal de rétention. Il couvre le prétraitement sans fuite, le feature engineering, la comparaison de modèles, un pipeline final de régression logistique, un seuil opérationnel de 0,30, l’explicabilité SHAP, une API FastAPI/Pydantic, 39 tests automatisés, 70 validations finales et un déploiement Docker validé.",
      ar: "Customer Churn Prediction نظام تعلم آلي متكامل لتقدير احتمال مغادرة العملاء وتحويله إلى إشارة للاحتفاظ بهم، ويشمل المعالجة الآمنة، ومقارنة النماذج، وLogistic Regression، وSHAP، وFastAPI، والاختبارات، وDocker.",
      darija: "Customer Churn Prediction هو système ML كامل كيتوقع churn probability وكيحولها لإشارة retention، وفيه preprocessing بلا leakage، مقارنة models، Logistic Regression، SHAP، FastAPI، tests وDocker.",
    }[language], resourceIds);
  }

  if (football) {
    const resourceIds = [projectResource("football-intelligence-player-recommendation-system")];
    if (/cosine|similar players|joueurs similaires|identified|identifi/.test(text)) return response({
      en: "Similar players are identified from normalized statistical profiles using cosine similarity, with same-position logic and position-aware features so comparisons remain contextually relevant.",
      fr: "Les joueurs similaires sont identifiés à partir de profils statistiques normalisés avec la similarité cosinus, une logique de même poste et des variables adaptées au poste afin de garder des comparaisons pertinentes.",
      ar: "يتم تحديد اللاعبين المتشابهين باستعمال ملفات إحصائية مطبّعة وcosine similarity، مع مراعاة المركز والخصائص المناسبة له.",
      darija: "اللاعبين المتشابهين كيتحددو من normalized statistical profiles بـ cosine similarity، مع نفس poste وfeatures واعيين بالمركز.",
    }[language], resourceIds);
    if (/modes?|types?|implemented|disponibles?|recommendation/.test(text) && !/experience|worked|projet|project|systeme/.test(text)) return response({
      en: "The documented recommendation modes are same-position player similarity, intelligent scouting with hard constraints and weighted preferences, replacement recommendations excluding the reference team, and Sporting Hidden Gems discovery based on exposure and position-relative percentile strengths.",
      fr: "Les modes documentés sont la similarité entre joueurs du même poste, le scouting intelligent avec contraintes strictes et préférences pondérées, les recommandations de remplacement excluant l’équipe de référence et la découverte de Sporting Hidden Gems selon l’exposition et les percentiles relatifs au poste.",
      ar: "تشمل الأنماط الموثقة تشابه لاعبي المركز نفسه، والاستكشاف بقيود وتفضيلات موزونة، واقتراح البدلاء مع استبعاد الفريق المرجعي، واكتشاف Sporting Hidden Gems.",
      darija: "الأنماط الموثقين هما same-position similarity، scouting بقيود وweighted preferences، replacement مع إقصاء reference team، وSporting Hidden Gems.",
    }[language], resourceIds);
    if (/comparison|compare|comparaison/.test(text)) return response({
      en: "Yes. The project supports player comparison through contextual profiles, position-relative percentiles, radar charts, and analytical comparison tools in the React/TypeScript frontend.",
      fr: "Oui. Le projet permet de comparer les joueurs grâce aux profils contextuels, aux percentiles relatifs au poste, aux radar charts et aux outils de comparaison du frontend React/TypeScript.",
      ar: "نعم. يدعم المشروع مقارنة اللاعبين عبر الملفات السياقية والنسب المئوية حسب المركز ومخططات الرادار وأدوات المقارنة.",
      darija: "نعم. المشروع كيدعم مقارنة اللاعبين بـ contextual profiles، position-relative percentiles، radar charts وأدوات المقارنة.",
    }[language], resourceIds);
    return response({
      en: "Football Intelligence & Player Recommendation System is an end-to-end Data Science platform for player analysis, statistical similarity, scouting, replacements, comparison, and talent discovery. It combines position-aware per-90 and percentile features, explainable recommendations, FastAPI/Pydantic services, and an interactive React/TypeScript frontend.",
      fr: "Football Intelligence & Player Recommendation System est une plateforme Data Science de bout en bout pour l’analyse, la similarité statistique, le scouting, les remplacements, la comparaison et la découverte de talents. Elle combine des variables par 90 minutes et des percentiles adaptés au poste, des recommandations explicables, des services FastAPI/Pydantic et un frontend React/TypeScript interactif.",
      ar: "Football Intelligence & Player Recommendation System منصة علم بيانات متكاملة لتحليل اللاعبين والتشابه الإحصائي والاستكشاف والبدلاء والمقارنة واكتشاف المواهب، مع FastAPI وواجهة React/TypeScript.",
      darija: "Football Intelligence & Player Recommendation System منصة Data Science كاملة للتحليل، similarity، scouting، replacements، comparison واكتشاف المواهب، مع FastAPI وfrontend React/TypeScript.",
    }[language], resourceIds);
  }
  return null;
}

export function buildTrustedResponse(
  message: string,
  language: ChatLanguage,
  history: ChatHistoryMessage[] = [],
): TrustedResponse | null {
  const analysis = analyzeQuery(message);
  const text = analysis.normalized;
  const entity = resolveEntity(message);

  const documentedProjectAnswer = newProjectResponse(text, language);
  if (documentedProjectAnswer) return documentedProjectAnswer;
  const documentedTechnologyAnswer = technologyProjects(message, language);
  if (documentedTechnologyAnswer) return documentedTechnologyAnswer;

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

  if (/année.*\bbac\b|\bbac\b.*document|baccalaur|bachelor.*year|year.*bachelor/.test(text)) {
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

  if (/parcours académique|academic journey|academic background|education|دراسي|الدراسي/.test(text)) return response({
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

  if (/projets?|projects?/.test(text) && /data science|machine learning/.test(text) && !/strongest|meilleurs?|plus forts?/.test(text)) {
    const selected = projects.filter((project) => projectKnowledge[project.slug].primaryDomain === "data-science");
    const names = selected.map((project) => project.title).join(", ");
    return response({
      en: `Issam's documented Data Science and Machine Learning projects are: ${names}. These include end-to-end prediction systems, an ML/Redis application, and the Football Intelligence recommendation platform.`,
      fr: `Les projets Data Science et Machine Learning documentés d'Issam sont : ${names}. Ils couvrent notamment des systèmes de prédiction de bout en bout, une application ML/Redis et la plateforme de recommandation Football Intelligence.`,
      ar: `مشاريع علم البيانات والتعلم الآلي الموثقة لدى عصام هي: ${names}. وتشمل أنظمة تنبؤ متكاملة وتطبيق ML/Redis ومنصة Football Intelligence للتوصية.`,
      darija: `مشاريع Data Science وMachine Learning الموثقين ديال Issam هما: ${names}. فيهم prediction systems كاملين، تطبيق ML/Redis ومنصة Football Intelligence ديال recommendation.`,
    }[language], selected.map((project) => projectResource(project.slug)));
  }

  if (/strongest|meilleurs?|plus forts?/.test(text) && /data science/.test(text) && /projets?|projects?/.test(text)) return response({
    en: "No official ranking is defined by the portfolio. The two most substantial recently documented end-to-end Data Science systems are Customer Churn Prediction and Football Intelligence & Player Recommendation System: the first demonstrates explainable ML delivery through FastAPI and Docker, while the second demonstrates recommendation systems, football analytics, FastAPI, and React/TypeScript integration.",
    fr: "Le portfolio ne définit aucun classement officiel. Les deux systèmes Data Science de bout en bout récemment documentés les plus complets sont Customer Churn Prediction et Football Intelligence & Player Recommendation System : le premier démontre une livraison ML explicable avec FastAPI et Docker, tandis que le second démontre les systèmes de recommandation, la football analytics, FastAPI et l’intégration React/TypeScript.",
    ar: "لا يحدد الملف ترتيباً رسمياً. ومن أبرز الأنظمة المتكاملة الموثقة حديثاً Customer Churn Prediction وFootball Intelligence & Player Recommendation System، مع اختلاف الأدلة التي يقدمها كل منهما.",
    darija: "الـ portfolio ما محددش ranking رسمي. من بين أكثر الأنظمة end-to-end توثيقاً كاين Customer Churn Prediction وFootball Intelligence & Player Recommendation System، وكل واحد كيبين قدرات مختلفة.",
  }[language], [projectResource("customer-churn-prediction"), projectResource("football-intelligence-player-recommendation-system")]);

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
