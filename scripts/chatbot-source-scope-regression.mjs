import { spawn } from "node:child_process";

async function startServer(port, apiKey) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...(apiKey ? { GROQ_API_KEY: apiKey } : {}) },
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { if ((await fetch(baseUrl)).ok) return { child, baseUrl }; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  child.kill();
  throw new Error(`Server ${port} did not start.`);
}

let sequence = 1;
async function ask(baseUrl, message, preferredLanguage = "fr") {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.88.0.${sequence++}` },
    body: JSON.stringify({ message, history: [], preferredLanguage }),
  });
  return { response, payload: await response.json() };
}

const contains = (answer, ...terms) => terms.every((term) => answer?.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
const excludes = (answer, ...terms) => terms.every((term) => !answer?.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
let failed = 0;
function report(ok, name, result) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) {
    failed += 1;
    console.log(`  status=${result.response.status} answer=${result.payload.answer ?? result.payload.error}`);
  }
}

const main = await startServer(3227);
try {
  let result = await ask(main.baseUrl, "Qui est Issam ?");
  report(result.response.ok && contains(result.payload.answer, "Master", "PFE") && result.payload.resources.length === 0, "profile presentation, not CV display", result);

  result = await ask(main.baseUrl, "Présente-moi Issam en quelques lignes.");
  report(result.response.ok && contains(result.payload.answer, "Data Science", "génie informatique"), "short presentation", result);

  result = await ask(main.baseUrl, "Montre-moi le CV d’Issam.");
  report(result.response.ok && result.payload.resources.some((item) => item.id === "profile:cv"), "explicit CV display", result);

  result = await ask(main.baseUrl, "Quels sont les projets mentionnés dans le CV d’Issam ?");
  report(result.response.ok && contains(result.payload.answer, "Customer Churn", "Intelligent Product Recommendation") && excludes(result.payload.answer, "Water Potability"), "CV project source constraint", result);

  result = await ask(main.baseUrl, "Quelles langues sont indiquées dans le CV ?");
  report(result.response.ok && contains(result.payload.answer, "arabe", "français", "anglais") && excludes(result.payload.answer, "Voici le CV"), "CV languages are answered", result);

  result = await ask(main.baseUrl, "Quelles sont les principales compétences d’Issam ?");
  report(result.response.ok && contains(result.payload.answer, "Backend", "Data Science", "Machine Learning"), "general skills remain multi-domain", result);

  result = await ask(main.baseUrl, "Quelles sont ses compétences en Data Science ?");
  report(result.response.ok && contains(result.payload.answer, "Pandas", "Scikit-Learn", "EDA") && excludes(result.payload.answer, "Backend Java"), "Data Science skills domain filter", result);

  result = await ask(main.baseUrl, "Quelles certifications sont liées au Machine Learning ?");
  report(result.response.ok && contains(result.payload.answer, "Supervised Machine Learning", "Introduction to Machine Learning", "Python for Machine Learning") && excludes(result.payload.answer, "Spring — Ecosystem"), "Machine Learning certification filter", result);

  result = await ask(main.baseUrl, "Pourquoi Issam serait-il un bon candidat pour un PFE en Data Science ou Machine Learning ?");
  report(result.response.ok && contains(result.payload.answer, "PFE", "Master") && excludes(result.payload.answer, "poste junior"), "PFE target preserved", result);

  result = await ask(main.baseUrl, "Quel âge a Issam ?");
  report(result.response.ok && contains(result.payload.answer, "âge", "pas documenté") && result.payload.resources.length === 0, "undocumented age", result);

  result = await ask(main.baseUrl, "Quel est son email ?");
  report(result.response.ok && excludes(result.payload.answer, "Souhaitez-vous", "Would you like"), "no artificial follow-up for email", result);
} finally {
  main.child.kill();
}

const outage = await startServer(3228, "invalid-source-scope-key");
try {
  const result = await ask(outage.baseUrl, "Quelle information totalement inconnue peux-tu fournir sur Issam ?");
  const expected = "Un problème technique empêche momentanément l’assistant IA de répondre. Veuillez réessayer votre question dans quelques instants. Si le problème persiste, rechargez la page puis posez votre question à nouveau.";
  report([502, 503].includes(result.response.status) && result.payload.error === expected, "technical Groq error text", result);
} finally {
  outage.child.kill();
}

if (failed) process.exitCode = 1;
