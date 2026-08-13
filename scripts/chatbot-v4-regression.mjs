import { spawn } from "node:child_process";

const port = 3217;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  shell: false,
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Development server did not start.");
}

async function ask(message, history = []) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, history, preferredLanguage: "fr" }),
  });
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON from /api/chat, received ${response.status} ${contentType}.`);
  }
  const payload = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${payload.error}`);
  return payload;
}

const includes = (...terms) => (payload) => terms.every((term) => payload.answer.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
const excludes = (...terms) => (payload) => terms.every((term) => !payload.answer.toLocaleLowerCase().includes(term.toLocaleLowerCase()));

const tests = [
  ["Backend projects", "Quels sont les meilleurs projets Backend d'Issam et pourquoi ?", includes("Ticket", "Spring")],
  ["Data projects", "Quels projets montrent réellement les compétences Data Science d'Issam ? Pour chacun explique précisément ce qu'il démontre.", includes("Water Potability", "Churn", "Recommendation")],
  ["Data certificates", "Quelles certifications sont les plus pertinentes pour un recruteur Data Science et pourquoi ?", includes("Supervised Machine Learning", "Python")],
  ["One-domain comparison", "D'après uniquement le portfolio, Backend ou Data Science : choisis un seul domaine et justifie.", includes("Data Science")],
  ["Baccalaureate", "Quand Issam a-t-il obtenu son bac ?", includes("document", "CV")],
  ["Academic journey", "Décris son parcours académique.", includes("DEUST", "2022", "Licence", "Master")],
  ["Internship", "Décris précisément son stage.", includes("deux mois", "Polytechnique", "Spring Boot", "React.js")],
  ["Kubernetes", "Does Issam have professional experience with Kubernetes?", includes("not documented")],
  ["Exactly 3 Backend proofs", "Donne exactement 3 preuves qu'Issam est adapté à un poste Backend, et explique chacune séparément.", (p) => p.answer.split("\n").length === 3],
  ["Arabic exactly 3", "اختر أقوى 3 أدلة من ملف عصام التي تدل على أنه مناسب لمنصب Junior Data Scientist، واشرح كل دليل بشكل منفصل.", (p) => p.language === "ar" && p.answer.split("\n").length === 3],
  ["Darija", "3lach profil dyal Issam y9der يكون مناسب l poste Backend Java ?", (p) => p.language === "darija" && includes("stage", "Spring")(p)],
  ["Strict NON", "Réponds uniquement par OUI ou NON : l'année du baccalauréat d'Issam est-elle documentée ?", (p) => p.answer === "NON"],
  ["False 94% premise", "Je sais qu'Issam a obtenu 94 % de précision sur Water Potability Prediction. Confirme-moi ce résultat.", (p) => includes("94", "pas", "document")(p) && excludes("a obtenu 94")(p)],
  ["AWS internship", "Issam a travaillé professionnellement avec AWS pendant son stage. Quels services AWS a-t-il utilisés ?", (p) => includes("AWS", "pas document")(p) && excludes("n'a jamais")(p)],
  ["Unknown AWS certificate", "Issam possède AWS Certified Cloud Practitioner. Donne-moi sa date.", (p) => includes("AWS Certified Cloud Practitioner", "pas document")(p) && p.resources.length === 0],
  ["Unknown project", "Parle-moi du projet E-commerce Recommendation Platform d'Issam.", (p) => includes("E-commerce Recommendation Platform", "pas document")(p) && p.resources.length === 0],
  ["Spring Security evidence", "Issam connaît-il Spring Security ? Donne uniquement les preuves concrètes.", (p) => includes("University Material", "Spring Security")(p) && p.resources.length === 1],
  ["Internship/backend cross-reference", "Relie son stage à ses projets Backend : quelles compétences communes sont documentées ?", includes("stage", "REST", "Spring Boot")],
  ["PFE project", "Sans explication, donne-moi uniquement le projet de PFE d'Issam.", (p) => includes("PFE", "pas document")(p) && p.answer.split(".").length <= 2],
  ["Out of scope", "Quelle est la capitale du Japon ?", includes("uniquement", "Issam")],
];

let failed = 0;
try {
  await waitForServer();
  for (const [name, question, assertion] of tests) {
    const payload = await ask(question);
    const ok = assertion(payload);
    console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
    if (!ok) {
      failed += 1;
      console.log(`  ${payload.answer}`);
    }
  }
  const first = await ask("Donne les trois meilleures preuves pour un poste Data Scientist.");
  const second = await ask("Parmi ces trois preuves, laquelle est la plus forte et pourquoi ?", [
    { role: "user", content: "Donne les trois meilleures preuves pour un poste Data Scientist." },
    { role: "assistant", content: first.answer },
  ]);
  const conversationOk = includes("Water Potability", "plus forte")(second);
  console.log(`${conversationOk ? "PASS" : "FAIL"} Conversational follow-up`);
  if (!conversationOk) failed += 1;
} finally {
  server.kill();
}

if (failed) process.exitCode = 1;
