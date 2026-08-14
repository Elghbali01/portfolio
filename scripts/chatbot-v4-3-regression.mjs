import { spawn } from "node:child_process";

const port = 3223;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { shell: false, stdio: ["ignore", "pipe", "pipe"] });
let sequence = 1;

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(baseUrl)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Server did not start");
}

async function ask(message, history = [], preferredLanguage = "fr") {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.43.0.${sequence++}` },
    body: JSON.stringify({ message, history, preferredLanguage }),
  });
  const payload = await response.json();
  return { response, payload };
}

const has = (answer, ...terms) => terms.every((term) => answer.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
const projectCards = (payload) => payload.resources.filter((r) => r.type === "project");
const numberedItems = (answer) => answer.split("\n").filter((line) => /^\d+\./.test(line.trim()));
let failed = 0;

async function test(name, message, check, history = [], language = "fr") {
  const result = await ask(message, history, language);
  const ok = result.response.ok && check(result.payload, result.response);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) {
    failed += 1;
    console.log(`  source=${result.response.headers.get("x-chat-source")} answer=${result.payload.answer ?? result.payload.error}`);
  }
  return result;
}

try {
  await waitForServer();
  await test("A FR backend 2 projects + internship", "Pour un poste Backend Java, donne-moi exactement 2 projets d'Issam qui constituent les meilleures preuves, explique brièvement pourquoi chacun est pertinent et dis-moi aussi ce que son stage apporte à sa candidature.", (p, r) => r.headers.get("x-chat-source") === "plan-composed" && numberedItems(p.answer).length === 2 && has(p.answer, "Ticket", "stage", "Spring") && projectCards(p).length === 2);
  await test("B FR AWS Kubernetes Spring Security", "Est-ce qu'Issam a utilisé AWS ou Kubernetes professionnellement, et quelle est sa meilleure preuve concrète qu'il connaît Spring Security ?", (p) => has(p.answer, "AWS", "Kubernetes", "Spring Security", "document") && !/jamais utilisé|never used/i.test(p.answer));
  await test("C EN 3 DS proofs + strongest", "hy, im recruiting for a junior data scientist role, can u tell me his 3 strongest evidences for this job and which one is the strongest? explain very briefly", (p) => p.language === "en" && numberedItems(p.answer).length === 3 && /Strongest:/.test(p.answer) && projectCards(p).length <= 3, [], "en");
  await test("D false premises plus real project and internship", "Issam got 94% accuracy on Water Potability and used AWS during his internship. Tell me what is actually documented about both the project and internship.", (p) => has(p.answer, "94", "AWS", "Water Potability", "Internship") && /not documented/i.test(p.answer), [], "en");
  await test("E Darija 2 backend projects + stage", "slm, bghit n3ref wach issam y9der l backend java, 3tini ghir 2 projets li kaybano a9wa preuves w chno stage dyalo kayzid lih", (p) => p.language === "darija" && numberedItems(p.answer).length === 2 && /stage/i.test(p.answer) && projectCards(p).length === 2, [], "darija");
  await test("F Arabic 3 DS proofs + best", "أعطني أقوى ثلاثة أدلة التي تبين أن عصام مناسب لمنصب عالم بيانات، واشرح كل دليل بجملة قصيرة ثم اختر الأفضل واذكر لماذا.", (p) => p.language === "ar" && numberedItems(p.answer).length === 3 && /أقوى دليل/.test(p.answer), [], "ar");

  await test("two known projects", "Compare Advanced Ticket Management System and Water Potability Prediction System briefly.", (p) => has(p.answer, "Advanced Ticket", "Water Potability"), [], "en");
  await test("known and unknown entity", "Tell me about Water Potability Prediction and E-commerce Recommendation Platform.", (p) => has(p.answer, "Water Potability", "E-commerce Recommendation", "not documented"), [], "en");
  await test("two undocumented plus documented technology", "Give concrete evidence for AWS, Kubernetes and Spring Security.", (p) => has(p.answer, "AWS", "Kubernetes", "Spring Security", "University Material"), [], "en");
  await test("project plus certification", "Présente Water Potability Prediction et la certification Supervised Machine Learning.", (p) => has(p.answer, "Water Potability", "Supervised Machine Learning"));
  await test("education plus internship", "Résume son parcours académique et son stage.", (p) => has(p.answer, "DEUST", "Master", "Stage"));
  await test("domain comparison justified", "Backend ou Data Science : compare les deux et justifie lequel est le plus fort.", (p) => has(p.answer, "Data Science", "Backend", "Master"));
  await test("exactly 2 no explanation", "Donne exactement 2 projets Backend, sans explication.", (p) => numberedItems(p.answer).length === 2 && projectCards(p).length === 2);
  await test("only strongest", "Give me only the strongest Data Science proof and a short reason.", (p) => numberedItems(p.answer).length === 1 || /Strongest:/.test(p.answer), [], "en");
  await test("mixed out of scope and portfolio", "Quelle est la capitale du Japon et quel est le meilleur projet Backend d'Issam ?", (p) => has(p.answer, "Hors périmètre", "Ticket"));

  const clarification = await test("clarification retained", "parle moi de son projet", (p) => /quel projet/i.test(p.answer));
  await test("clarification follow-up", "Advanced Ticket Management", (p) => /Advanced Ticket Management/.test(p.answer), [
    { role: "user", content: "parle moi de son projet" },
    { role: "assistant", content: clarification.payload.answer },
  ]);
} finally {
  server.kill();
}

if (failed) process.exitCode = 1;
