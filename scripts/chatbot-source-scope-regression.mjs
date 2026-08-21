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

async function askWithoutPreference(baseUrl, message) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.89.0.${sequence++}` },
    body: JSON.stringify({ message, history: [] }),
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
  let result = await askWithoutPreference(main.baseUrl, "Qui est Issam ?");
  report(result.response.ok && result.payload.language === "fr" && contains(result.payload.answer, "est étudiant", "Master", "PFE") && excludes(result.payload.answer, "is a Data Science") && result.payload.resources.length === 0, "French profile presentation, not CV display", result);

  result = await askWithoutPreference(main.baseUrl, "Présente-moi Issam en quelques lignes.");
  report(result.response.ok && result.payload.language === "fr" && contains(result.payload.answer, "est étudiant", "Data Science", "génie informatique"), "French short presentation", result);

  result = await askWithoutPreference(main.baseUrl, "Who is Issam?");
  report(result.response.ok && result.payload.language === "en" && contains(result.payload.answer, "is a Data Science", "Master") && excludes(result.payload.answer, "est étudiant"), "English profile presentation", result);

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

  result = await askWithoutPreference(main.baseUrl, "le numéro de Issam svp");
  report(result.response.ok && result.payload.language === "fr" && contains(result.payload.answer, "06 20 68 83 40"), "phone with configured Groq", result);
} finally {
  main.child.kill();
}

const outage = await startServer(3228, "invalid-source-scope-key");
try {
  let result = await askWithoutPreference(outage.baseUrl, "Pourquoi Issam serait-il adapté à cette opportunité ?");
  const expected = "Un problème technique empêche momentanément l’assistant IA de répondre. Veuillez réessayer votre question dans quelques instants. Si le problème persiste, rechargez la page puis posez votre question à nouveau.";
  report([502, 503].includes(result.response.status) && result.payload.error === expected, "French technical Groq error text without language preference", result);

  result = await askWithoutPreference(outage.baseUrl, "Why would Issam be a better fit for this opportunity than another candidate?");
  report([502, 503].includes(result.response.status) && contains(result.payload.error, "A technical problem", "reload the page"), "English technical Groq error text", result);

  for (const question of ["Quel est le numéro de téléphone d’Issam ?", "le numéro de Issam svp"]) {
    result = await askWithoutPreference(outage.baseUrl, question);
    report(result.response.ok && result.payload.language === "fr" && contains(result.payload.answer, "06 20 68 83 40"), `safe phone fallback: ${question}`, result);
  }

  result = await askWithoutPreference(outage.baseUrl, "Quel est l’email d’Issam ?");
  report(result.response.ok && result.payload.language === "fr" && contains(result.payload.answer, "elghbaliissam1@gmail.com"), "safe email fallback", result);

  result = await askWithoutPreference(outage.baseUrl, "Montre-moi le CV d’Issam.");
  report(result.response.ok && result.payload.language === "fr" && result.payload.resources.some((item) => item.id === "profile:cv"), "safe CV fallback", result);

  result = await askWithoutPreference(outage.baseUrl, "Peux-tu chercher ailleurs si l’information n’est pas dans son portfolio ou son CV ?");
  report(result.response.ok && result.payload.language === "fr" && contains(result.payload.answer, "uniquement", "portfolio", "CV", "pas documentée") && excludes(result.payload.answer, "internet pour"), "documented source policy fallback", result);
} finally {
  outage.child.kill();
}

if (failed) process.exitCode = 1;
