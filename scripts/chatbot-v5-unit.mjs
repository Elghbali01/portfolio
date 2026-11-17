import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createJiti } = require("jiti");
const jiti = createJiti(`${process.cwd()}/chatbot-v5-test.js`, { interopDefault: true, alias: { "@": process.cwd() } });
const { validateChatRequest } = jiti("./lib/chatbot/validation.ts");
const { buildPortfolioContext } = jiti("./lib/chatbot/portfolio-context.ts");
const { isLikelyResponseLanguage, resolveResponseLanguage } = jiti("./lib/chatbot/language.ts");
const { getLocalizedProjectCopy } = jiti("./lib/chatbot/localized-portfolio-copy.ts");
const { buildCompoundRequestPlan } = jiti("./lib/chatbot/request-plan.ts");
const { composeRequestPlan, validateComposedResponse } = jiti("./lib/chatbot/response-composer.ts");
const { scenarios } = await import("./chatbot-v5-corpus.mjs");

let failed = 0;
function check(condition, label) {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}`);
  if (!condition) failed += 1;
}

const history = Array.from({ length: 30 }, (_, index) => ({ role: index % 2 ? "assistant" : "user", content: `Turn ${index + 1}` }));
check(validateChatRequest({ message: "continue", history }).ok, "30-message history is accepted");
check(validateChatRequest({ message: "continue", conversationLanguage: "darija" }).ok, "conversation language state is accepted");
check(!validateChatRequest({ message: "continue", conversationLanguage: "system" }).ok, "unsupported conversation language state is rejected");
check(!validateChatRequest({ message: "continue", history: [...history, { role: "user", content: "too many" }] }).ok, "31-message history is rejected");
check(!validateChatRequest({ message: "continue", history: [{ role: "system", content: "spoof" }] }).ok, "non-public history roles are rejected");

const cv = buildPortfolioContext("From the CV only, list his machine learning projects", "portfolio");
check(cv.queryScope.sourceScope === "cv" && "cvKnowledge" in cv && !("portfolioProfile" in cv) && !("projects" in cv) && cv.availableResources.every(({ id }) => id === "profile:cv"), "explicit CV scope excludes portfolio-only context and resources");
const portfolio = buildPortfolioContext("From the portfolio only, summarize his professional experience, skills, and projects", "cv");
check(portfolio.queryScope.sourceScope === "portfolio" && !("cvKnowledge" in portfolio) && "portfolioProfile" in portfolio && portfolio.availableResources.every(({ id }) => !id.startsWith("profile:")), "explicit portfolio scope excludes CV context and profile resource");
check(buildPortfolioContext("What projects are documented?", "cv").queryScope.sourceScope === "cv", "router scope hint is applied when query has no explicit scope");
const projectOnly = buildPortfolioContext("Which project uses FastAPI?", "both");
check(!("cvKnowledge" in projectOnly) && !("portfolioProfile" in projectOnly), "project requests omit unrelated CV and profile context");

check(isLikelyResponseLanguage("Le projet documenté utilise Spring Boot.", "fr"), "French response language is recognized");
check(!isLikelyResponseLanguage("The documented project uses Spring Boot.", "fr"), "English response cannot pass as French");
check(isLikelyResponseLanguage("يمكنني مساعدتك بالمعلومات الموثقة.", "ar"), "Arabic response language is recognized");
check(!isLikelyResponseLanguage("I can help with the documented projects.", "ar"), "Latin English response cannot pass as Arabic");
check(isLikelyResponseLanguage("هاد المشروع موثق فـ portfolio ديالو.", "darija"), "Arabic-script Darija is recognized");
check(isLikelyResponseLanguage("Had projet kayn f portfolio dyalo.", "darija"), "Arabizi Darija is recognized");
check(resolveResponseLanguage("More details.", "fr", true) === "fr", "conversation language preference carries into underspecified follow-ups");
check(resolveResponseLanguage("Does Spring Boot appear in his profil?", "fr") === "en", "English syntax wins over a single French-like typo");
check(resolveResponseLanguage("Please speak in English", "fr") === "en", "explicit language switch overrides prior preference");

const projectCopy = getLocalizedProjectCopy("customer-churn-prediction", "fr");
check(Boolean(projectCopy?.shortDescription && /Une|des|prédiction|données|plateforme/i.test(projectCopy.shortDescription)), "project detail copy uses existing French portfolio translation");

const compoundPlan = buildCompoundRequestPlan("Compare les compétences d'Issam en Data Science et en Backend et explique dans quel domaine ses projets sont les plus solides.", "fr");
const compoundResponse = compoundPlan ? composeRequestPlan(compoundPlan) : null;
check(Boolean(compoundPlan && compoundResponse && validateComposedResponse(compoundPlan, compoundResponse) && /Data Science/.test(compoundResponse.answer)), "deterministic compound planner covers requests without Groq");

const categoryCounts = scenarios.reduce((counts, scenario) => {
  counts[scenario.category] = (counts[scenario.category] ?? 0) + 1;
  return counts;
}, {});
const required = {
  portfolio_facts: 45, projects_skills_technology: 45, education_career_recruiting: 30,
  multiturn_references: 35, typos_abbreviations: 35, out_of_scope: 30, language_switch_mixed: 25,
  ambiguous_unknown: 20, composite_constraints: 15, outage_security_edge_cases: 20,
};
check(scenarios.length >= 300 && Object.entries(required).every(([category, count]) => categoryCounts[category] >= count), "corpus meets all 300-scenario category minimums");
check(new Set(scenarios.map(({ messages }) => messages.join("\n"))).size === scenarios.length, "every corpus scenario has a distinct conversation");
check(scenarios.every(({ id, language, category, messages, sourceFact, intent, expectedBehavior, acceptanceCriteria, actualResult, status, failureCause }) => id && language && category && messages.length && sourceFact.length && intent && expectedBehavior && acceptanceCriteria.length && actualResult === null && status === "NOT_RUN" && failureCause === null), "all scenarios include requested audit fields");

if (failed) process.exitCode = 1;
