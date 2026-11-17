import http from "node:http";

const port = Number(process.env.MOCK_GROQ_PORT ?? 3240);
const mode = process.env.MOCK_GROQ_MODE ?? "success";
let requestCount = 0;
let assistantInputMessageCount = 0;
const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/__mock-groq/status") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ requestCount, assistantInputMessageCount }));
    return;
  }
  if (request.method !== "POST" || !request.url?.endsWith("/chat/completions")) {
    response.writeHead(404).end();
    return;
  }
  requestCount += 1;
  if (mode === "timeout") return;
  if (mode === "error") {
    response.writeHead(502, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: { message: "Mock provider failure" } }));
    return;
  }
  if (mode === "rate-limit") {
    response.writeHead(429, { "content-type": "application/json", "retry-after": "1" });
    response.end(JSON.stringify({ error: { message: "Mock provider rate limit" } }));
    return;
  }
  const authorization = request.headers.authorization ?? "";
  if (/invalid/i.test(authorization)) {
    response.writeHead(401, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: { message: "Invalid API Key", type: "invalid_request_error", code: "invalid_api_key" } }));
    return;
  }
  let raw = "";
  for await (const chunk of request) raw += chunk;
  const body = JSON.parse(raw);
  assistantInputMessageCount += body.messages?.filter(({ role }) => role === "assistant").length ?? 0;
  const system = body.messages?.find(({ role }) => role === "system")?.content ?? "";
  const latest = body.messages?.filter(({ role }) => role === "user").at(-1)?.content ?? "";
  const query = latest.match(/LATEST(?:_USER)?_MESSAGE:\s*([\s\S]*?)(?:\n\nMANDATORY RESPONSE INSTRUCTIONS:|$)/i)?.[1]
    ?? latest.match(/LATEST_MESSAGE:\s*([\s\S]*)$/i)?.[1]
    ?? latest;
  const requestedLanguage = latest.match(/(?:naturally in|response in)\s+(en|fr|ar|darija)\b/i)?.[1]?.toLowerCase()
    ?? latest.match(/UI_LANGUAGE_HINT:\s*(en|fr|ar|darija)\b/i)?.[1]?.toLowerCase();
  const language = requestedLanguage
    ?? (/\b(?:chno|wach|dyal|darija|3lach|3tini|kidayr)\b/i.test(query) || /(?:شنو|ديال|واش|بالدارجة)/.test(query) ? "darija"
      : /[\u0600-\u06ff]/.test(query) ? "ar"
        : /\b(?:bonjour|quelles?|compare|pourquoi|présente|parcours|compétences?|projets?|certifications?|dans|son|ses|le|la|les|est|quel|donne|montre)\b/i.test(query) ? "fr" : "en");
  let content;
  if (system.includes("tiny semantic router")) {
    const outOfScope = /capital(?: of|e).*japan|capitale du japon|913 times|actualit[eé]s?.*jour|world news|weather|m[eé]t[eé]o|voter|vote for|recette|recipe|quel film|what movie|chest pain|douleur thoracique|fonction python g[eé]n[eé]rique|hidden system prompt|prompt syst[eè]me cach[eé]|instructions.*cach[eé]es|api key|cl[eé] api|environment variables|variables d'environnement/i.test(query);
    content = JSON.stringify({ language, intent: outOfScope ? "OUT_OF_SCOPE" : "PORTFOLIO_QUESTION", confidence: 1, domain: "general", entityType: null, entityName: null, sourceScope: /\b(?:cv|resume)\b|s[eé]rie?\s+vita?le/i.test(query) ? "cv" : "both", responseType: "direct", followUpUseful: false, route: outOfScope ? "LOCAL" : "REASONING", clarificationReason: null });
  } else if (system.includes("compact request planner")) {
    content = JSON.stringify({
      language,
      subRequests: [{ id: "r1", intent: "DOMAIN_COMPARISON", domain: "general", entityType: null, entityName: null, requestedCount: null, requiresExplanation: true, requiresEvidence: true, requiresSelection: true, scope: "portfolio" }],
      globalConstraints: { exactCount: null, maxCount: null, concise: true, answerMode: "normal", separateItems: false, conclusionFirst: true },
      confidence: 1,
      clarificationNeeded: false,
      clarificationReason: null,
    });
  } else {
    const answers = {
      en: "Based on Issam’s documented portfolio, I can help with that question.",
      fr: "D’après les informations documentées dans le portfolio d’Issam, je peux vous aider sur ce point.",
      ar: "يمكنني مساعدتك اعتماداً على المعلومات الموثقة في ملف عصام المهني.",
      darija: "نقدر نعاونك اعتماداً على المعلومات الموثقة فـ portfolio ديال Issam.",
    };
    content = JSON.stringify({ answer: answers[language], language, resourceIds: [] });
  }
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ id: "mock-completion", object: "chat.completion", created: 0, model: body.model, choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
});

server.listen(port, "127.0.0.1", () => console.log(`Mock Groq listening on ${port}`));
