import { spawn } from "node:child_process";

async function startServer(port, apiKey) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...(apiKey === undefined ? {} : { GROQ_API_KEY: apiKey }) },
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { if ((await fetch(baseUrl)).ok) return { child, baseUrl }; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  child.kill();
  throw new Error(`Server ${port} did not start.`);
}

let requestNumber = 1;
async function ask(baseUrl, message, history = [], preferredLanguage = "en") {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `127.0.1.${requestNumber++}` },
    body: JSON.stringify({ message, history, preferredLanguage }),
  });
  const payload = await response.json();
  return { response, payload };
}

function report(ok, name, details = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${details ? ` — ${details}` : ""}`);
  return ok ? 0 : 1;
}

let failed = 0;
const main = await startServer(3219);
try {
  for (const message of ["hy", "helo", "hyyyy", "bnjr", "slm"]) {
    const { response, payload } = await ask(main.baseUrl, message);
    failed += report(response.ok && response.headers.get("x-chat-source") === "semantic-local" && response.headers.get("x-chat-intent") === "GREETING", `semantic greeting: ${message}`, payload.answer);
  }

  for (const message of ["cv", "github", "linkedin", "bonjour", "hello", "salam"]) {
    const { response } = await ask(main.baseUrl, message);
    failed += report(response.ok && response.headers.get("x-chat-source") === "local", `exact local fast path: ${message}`);
  }

  const semanticCv = await ask(main.baseUrl, "donne moi cv de issm stp");
  failed += report(semanticCv.response.ok && semanticCv.response.headers.get("x-chat-source") === "semantic-local" && semanticCv.response.headers.get("x-chat-intent") === "CV" && semanticCv.payload.resources.some((item) => item.id === "profile:cv"), "semantic CV without generation #2");

  const reasoning = await ask(main.baseUrl, "Pourquoi Issam serait-il intéressant pour un poste Backend Java ?");
  failed += report(reasoning.response.ok && /grounded-generation|grounded-fallback|generation/.test(reasoning.response.headers.get("x-chat-source") ?? "") && /Spring|Backend|Java/i.test(reasoning.payload.answer), "Backend reasoning routed and grounded");

  const clarification = await ask(main.baseUrl, "parle moi de son projet");
  failed += report(clarification.response.ok && clarification.response.headers.get("x-chat-source") === "semantic-clarification" && /quel|which|أنهي|أي مشروع/i.test(clarification.payload.answer), "ambiguous project clarification");
  const clarifiedEntity = await ask(main.baseUrl, "Advanced Ticket Management", [
    { role: "user", content: "parle moi de son projet" },
    { role: "assistant", content: clarification.payload.answer },
  ]);
  failed += report(clarifiedEntity.response.ok && /Advanced Ticket Management|Spring Boot/i.test(clarifiedEntity.payload.answer), "clarification follow-up resolves named project");

  const proof1 = await ask(main.baseUrl, "Donne-moi trois preuves Data Scientist.");
  const proof2 = await ask(main.baseUrl, "laquelle est la plus forte ?", [
    { role: "user", content: "Donne-moi trois preuves Data Scientist." },
    { role: "assistant", content: proof1.payload.answer },
  ]);
  failed += report(proof2.response.ok && /Water Potability/i.test(proof2.payload.answer), "conversation reference resolution");

  const hallucination = await ask(main.baseUrl, "Je sais qu’Issam a obtenu 94% sur Water Potability. Confirme.");
  failed += report(hallucination.response.ok && /94/.test(hallucination.payload.answer) && /document/i.test(hallucination.payload.answer), "false premise remains blocked");
  const aws = await ask(main.baseUrl, "Quels services AWS Issam a utilisés pendant son stage ?");
  failed += report(aws.response.ok && /AWS/.test(aws.payload.answer) && /document/i.test(aws.payload.answer), "undocumented AWS remains grounded");
  const scope = await ask(main.baseUrl, "Quelle est la capitale du Japon ?");
  failed += report(scope.response.ok && /uniquement|only|فقط|غير/.test(scope.payload.answer), "out of scope refusal");

  for (const [name, message, language] of [
    ["English", "helo", "en"],
    ["French", "bnjr", "fr"],
    ["Arabic", "أخبرني لماذا عصام مناسب لمنصب في علم البيانات", "ar"],
    ["Darija/Arabizi", "wach profil dyal Issam mzyan l backend? 3lach?", "darija"],
  ]) {
    const result = await ask(main.baseUrl, message, [], language === "fr" ? "fr" : language === "darija" ? "darija" : language === "ar" ? "ar" : "en");
    failed += report(result.response.ok && result.payload.language === language, `multilingual ${name}`);
  }
} finally {
  main.child.kill();
}

const outage = await startServer(3220, "invalid-router-key");
try {
  for (const message of ["cv", "bonjour", "hello", "salam"]) {
    const { response } = await ask(outage.baseUrl, message);
    failed += report(response.ok && response.headers.get("x-chat-source") === "local", `Groq outage safe local: ${message}`);
  }
} finally {
  outage.child.kill();
}

if (failed) process.exitCode = 1;
