import { spawn } from "node:child_process";

const port = 3225;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  shell: false,
  stdio: ["ignore", "pipe", "pipe"],
});
let sequence = 1;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { if ((await fetch(baseUrl)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Production server did not start.");
}

async function ask(message, preferredLanguage = "en") {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.55.0.${sequence++}` },
    body: JSON.stringify({ message, history: [], preferredLanguage }),
  });
  const payload = await response.json();
  return { response, payload };
}

const has = (...terms) => ({ payload }) => terms.every((term) => payload.answer?.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
const resource = (slug) => ({ payload }) => payload.resources?.some((item) => item.id === `project:${slug}`);
const both = (...checks) => (result) => checks.every((check) => check(result));

const tests = [
  ["1 Customer Churn detail EN", "Tell me about the Customer Churn Prediction project.", "en", both(has("Customer Churn", "Logistic Regression", "FastAPI"), resource("customer-churn-prediction"))],
  ["2 Customer Churn detail FR", "Parle-moi du projet Customer Churn Prediction.", "fr", both(has("Customer Churn", "régression logistique", "FastAPI"), resource("customer-churn-prediction"))],
  ["3 Churn selected model", "What model was selected for churn prediction?", "en", has("Logistic Regression", "0.30")],
  ["4 Churn ROC-AUC", "What ROC-AUC did the churn model achieve?", "en", has("0.8429", "285", "374")],
  ["5 SHAP", "Does Issam have experience with SHAP?", "en", has("Yes", "SHAP", "causal")],
  ["6 Docker ML", "Has Issam used Docker in a Machine Learning project?", "en", both(has("Docker", "Customer Churn"), resource("customer-churn-prediction"))],
  ["7 FastAPI projects", "Which projects use FastAPI?", "en", has("Customer Churn", "Football Intelligence")],
  ["8 Football detail EN", "Tell me about the Football Intelligence project.", "en", both(has("Football Intelligence", "recommendation", "FastAPI"), resource("football-intelligence-player-recommendation-system"))],
  ["9 Football detail FR", "Parle-moi du système de recommandation de joueurs.", "fr", has("Football Intelligence", "recommandation", "React")],
  ["10 Similar players", "How are similar players identified?", "en", has("normalized", "cosine similarity", "same-position")],
  ["11 Recommendation experience", "Does Issam have experience with recommendation systems?", "en", has("Football Intelligence", "recommendation")],
  ["12 Cosine role", "What is the role of cosine similarity in the football project?", "en", has("normalized", "cosine similarity", "position")],
  ["13 Recommendation modes", "What recommendation modes are implemented?", "en", has("same-position", "scouting", "replacement", "Hidden Gems")],
  ["14 Player comparison", "Does the project support player comparison?", "en", has("Yes", "radar", "percentiles")],
  ["15 Data Science projects", "What Data Science projects has Issam built?", "en", has("Water Potability", "Customer Churn", "Football Intelligence")],
  ["16 ML projects FR", "Quels sont les projets Machine Learning d’Issam ?", "fr", has("Water Potability", "Customer Churn", "Football Intelligence")],
  ["17 Scikit-learn projects", "Which projects use scikit-learn?", "en", has("Water Potability", "Customer Churn", "Football Intelligence")],
  ["18 React projects", "Which projects use React?", "en", has("Academic Resource", "Football Intelligence")],
  ["19 Data Science and FastAPI", "Which projects combine Data Science and FastAPI?", "en", has("Customer Churn", "Football Intelligence")],
  ["20 Strongest Data Science", "What are Issam's strongest Data Science projects?", "en", has("no official ranking", "Customer Churn", "Football Intelligence")],
  ["NR education", "What is his academic background?", "en", has("DEUST", "Master")],
  ["NR education FR", "Quel est son parcours académique ?", "fr", has("DEUST", "Master")],
  ["NR skills", "What are his main skills?", "en", has("Backend", "Data Science")],
  ["NR certifications", "What certifications does Issam have?", "en", has("documented certifications", "Supervised Machine Learning")],
  ["NR old project", "Tell me about the Water Potability Prediction System.", "en", both(has("Water Potability", "Model comparison"), resource("water-potability-ml"))],
];

let failed = 0;
try {
  await waitForServer();
  for (const [name, question, language, check] of tests) {
    const result = await ask(question, language);
    const ok = result.response.ok && check(result);
    console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
    if (!ok) {
      failed += 1;
      console.log(`  status=${result.response.status} answer=${result.payload.answer ?? result.payload.error}`);
    }
  }
} finally {
  server.kill();
}

if (failed) process.exitCode = 1;
