import { createRequire } from "node:module";
import { spawn } from "node:child_process";

const require = createRequire(import.meta.url);
const { createJiti } = require("jiti");
const jiti = createJiti(`${process.cwd()}/compound-test.js`, { interopDefault: true, alias: { "@": process.cwd() } });
const { buildCompoundRequestPlan } = jiti("./lib/chatbot/request-plan.ts");
const { composeRequestPlan, validateComposedResponse } = jiti("./lib/chatbot/response-composer.ts");

let failed = 0;
function report(ok, name, details = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) {
    failed += 1;
    if (details) console.log(`  ${details}`);
  }
}
const has = (value, ...terms) => terms.every((term) => value?.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
const lacks = (value, ...terms) => terms.every((term) => !value?.toLocaleLowerCase().includes(term.toLocaleLowerCase()));

function compose(message, language = "fr") {
  const plan = buildCompoundRequestPlan(message, language);
  const response = plan ? composeRequestPlan(plan) : null;
  return { plan, response, valid: Boolean(plan && response && validateComposedResponse(plan, response)) };
}

let result = compose("Compare les compétences d’Issam en Data Science et en Backend.");
report(result.valid && has(result.response.answer, "Data Science", "Backend", "Comparaison", "Spring Boot", "Pandas"), "A skills comparison", result.response?.answer);

result = compose("Compare les compétences d’Issam en Data Science et en Backend et explique dans quel domaine ses projets sont les plus solides.");
report(result.valid && has(result.response.answer, "Data Science", "Backend", "projets ML", "reste solide", "Spring Boot") && result.response.resourceIds.includes("project:water-potability-ml") && result.response.resourceIds.includes("project:ticket-management-system"), "B skills plus project-strength comparison", result.response?.answer);

result = compose("Quels projets et certifications montrent ses compétences en Machine Learning ?");
report(result.valid && has(result.response.answer, "Water Potability", "Supervised Machine Learning", "Introduction to Machine Learning") && result.response.resourceIds.some((id) => id.startsWith("project:")) && result.response.resourceIds.some((id) => id.startsWith("certificate:")), "C projects and certifications for ML", result.response?.answer);

result = compose("Quelles sont ses compétences en Data Science et Machine Learning ?");
report(result.valid && has(result.response.answer, "Data Science", "Machine Learning", "Pandas", "Supervised Learning"), "D two skill domains", result.response?.answer);

result = compose("Dans son CV, quels projets et compétences montrent son expérience en Machine Learning ?");
report(result.valid && has(result.response.answer, "Customer Churn", "Intelligent Product Recommendation", "Machine Learning", "SHAP") && lacks(result.response.answer, "Water Potability", "Football Intelligence") && result.response.resourceIds.includes("profile:cv"), "E CV-scoped projects and skills", result.response?.answer);

result = compose("Compare Customer Churn Prediction et Water Potability Prediction System.");
report(result.valid && has(result.response.answer, "Customer Churn Prediction", "Water Potability Prediction System", "Comparaison") && result.response.resourceIds.filter((id) => id.startsWith("project:")).length === 2, "F named project comparison", result.response?.answer);

async function startOfflineServer(port) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GROQ_API_KEY: "" },
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { if ((await fetch(baseUrl)).ok) return { child, baseUrl }; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  child.kill();
  throw new Error("Offline server did not start.");
}

const offline = await startOfflineServer(3237);
try {
  const response = await fetch(`${offline.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "10.91.0.99" },
    body: JSON.stringify({ message: "Compare les compétences d’Issam en Data Science et en Backend et explique dans quel domaine ses projets sont les plus solides.", history: [] }),
  });
  const payload = await response.json();
  report(response.status === 503 && has(payload.error, "problème technique", "réessay") && lacks(payload.error, "projets Data Science documentés"), "G no partial compound fallback during Groq outage", payload.answer ?? payload.error);
} finally {
  offline.child.kill();
}

if (failed) process.exitCode = 1;
