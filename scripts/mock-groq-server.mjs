import http from "node:http";

const port = Number(process.env.MOCK_GROQ_PORT ?? 3240);
const server = http.createServer(async (request, response) => {
  if (request.method !== "POST" || !request.url?.endsWith("/chat/completions")) {
    response.writeHead(404).end();
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
  const system = body.messages?.find(({ role }) => role === "system")?.content ?? "";
  const latest = body.messages?.at(-1)?.content ?? "";
  const language = /[\u0600-\u06ff]/.test(latest) ? "ar" : /\b(?:qui|quelles?|compare|pourquoi|présente|parcours|compétences?|projets?|certifications?|dans|son|ses)\b/i.test(latest) ? "fr" : "en";
  let content;
  if (system.includes("tiny semantic router")) {
    content = JSON.stringify({ language, intent: "PORTFOLIO_QUESTION", confidence: 1, domain: "general", entityType: null, entityName: null, sourceScope: /\b(?:cv|resume)\b/i.test(latest) ? "cv" : "both", responseType: "direct", followUpUseful: false, route: "REASONING", clarificationReason: null });
  } else if (system.includes("compact request planner")) {
    content = "{}";
  } else {
    content = JSON.stringify({ answer: language === "fr" ? "Réponse structurée locale simulée." : language === "ar" ? "إجابة محلية منظمة ومحاكاة." : "Simulated local structured response.", language, resourceIds: [] });
  }
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ id: "mock-completion", object: "chat.completion", created: 0, model: body.model, choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
});

server.listen(port, "127.0.0.1", () => console.log(`Mock Groq listening on ${port}`));
