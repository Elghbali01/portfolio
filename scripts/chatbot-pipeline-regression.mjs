import { spawn } from "node:child_process";

const siteOrigin = "https://portfolio-jade-six-ys9gex8x7k.vercel.app";
let nextRequestId = 1;

function startProcess(args, env) {
  return spawn(process.execPath, args, {
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...env },
  });
}

async function waitFor(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function startMock(port, mode = "success") {
  const child = startProcess(["scripts/mock-groq-server.mjs"], {
    MOCK_GROQ_PORT: String(port),
    MOCK_GROQ_MODE: mode,
  });
  await waitFor(`http://127.0.0.1:${port}/__mock-groq/status`);
  return { child, port };
}

async function startNext(port, mockPort, timeoutMs = 8_000, overrides = {}) {
  const child = startProcess(["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    NEXT_PUBLIC_SITE_URL: siteOrigin,
    GROQ_API_KEY: "mock-key",
    GROQ_BASE_URL: `http://127.0.0.1:${mockPort}/v1`,
    GROQ_MOCK_MODE: "1",
    GROQ_TIMEOUT_MS: String(timeoutMs),
    CHAT_TRUSTED_IP_HEADER: "x-test-client-ip",
    ...overrides,
  });
  await waitFor(`http://127.0.0.1:${port}`);
  return { child, baseUrl: `http://127.0.0.1:${port}` };
}

async function ask(baseUrl, message, options = {}) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-test-client-ip": options.ip ?? `test-${nextRequestId++}`,
    },
    body: JSON.stringify({ message, history: options.history ?? [], preferredLanguage: options.preferredLanguage ?? "en" }),
  });
  const payload = await response.json();
  return { response, payload };
}

async function mockCount(port) {
  return (await (await fetch(`http://127.0.0.1:${port}/__mock-groq/status`)).json()).requestCount;
}

function report(ok, name, details = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${details ? ` — ${details}` : ""}`);
  return ok ? 0 : 1;
}

let failed = 0;
const successMock = await startMock(3240);
const main = await startNext(3230, successMock.port);
try {
  const greeting = await ask(main.baseUrl, "hello", { ip: "deterministic" });
  const cv = await ask(main.baseUrl, "give me the cv", { ip: "deterministic" });
  failed += report(greeting.response.ok && cv.response.ok && await mockCount(successMock.port) === 0, "deterministic paths make zero Groq calls");

  const clarification = await ask(main.baseUrl, "parle moi de son projet", { preferredLanguage: "fr", ip: "clarification" });
  failed += report(clarification.response.ok && clarification.response.headers.get("x-chat-source") === "semantic-clarification" && await mockCount(successMock.port) === 0, "ambiguous project request keeps local clarification");

  const reasoning = await ask(main.baseUrl, "Why would Issam be interesting for a Backend Java role?", { ip: "reasoning" });
  failed += report(reasoning.response.ok && await mockCount(successMock.port) === 2, "non-deterministic request uses one router and one generation call");

  const beforePlan = await mockCount(successMock.port);
  await ask(main.baseUrl, "Compare his Data Science and Backend skills.", { ip: "planner" });
  failed += report(await mockCount(successMock.port) === beforePlan + 1, "compound request uses one planner call without a redundant preflight");

  const tooLarge = await fetch(`${main.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-test-client-ip": "payload" },
    body: JSON.stringify({ message: "x".repeat(70_000) }),
  });
  failed += report(tooLarge.status === 413, "oversized body is rejected before JSON validation");

  const invalidJson = await fetch(`${main.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-test-client-ip": "payload" },
    body: "{invalid",
  });
  failed += report(invalidJson.status === 400, "invalid JSON returns 400");

  let lastStatus = 0;
  for (let index = 0; index < 61; index += 1) {
    lastStatus = (await ask(main.baseUrl, "hello", { ip: "rate-limit" })).response.status;
  }
  failed += report(lastStatus === 429, "configured trusted identity is rate limited locally");
} finally {
  main.child.kill();
  successMock.child.kill();
}

const hostedGuardMock = await startMock(3243);
const hostedGuardApp = await startNext(3233, hostedGuardMock.port, 50, {
  VERCEL: "1",
  VERCEL_ENV: "production",
  GROQ_API_KEY: "",
});
try {
  const beforeGuard = await mockCount(hostedGuardMock.port);
  await ask(hostedGuardApp.baseUrl, "Why would Issam be interesting for a Backend Java role?", { ip: "vercel-guard" });
  failed += report(await mockCount(hostedGuardMock.port) === beforeGuard, "mock base URL cannot divert a Vercel-like runtime");
} finally {
  hostedGuardApp.child.kill();
  hostedGuardMock.child.kill();
}

for (const [mode, mockPort, appPort] of [["error", 3241, 3231], ["timeout", 3242, 3232]]) {
  const providerMock = await startMock(mockPort, mode);
  const app = await startNext(appPort, mockPort, 50);
  try {
    const result = await ask(app.baseUrl, "Why would Issam be interesting for a Backend Java role?", { ip: mode });
    const safeFallback = result.response.status === 200 && result.response.headers.get("x-chat-source") === "grounded-fallback";
    failed += report(safeFallback || [502, 503].includes(result.response.status), `provider ${mode} returns a controlled fallback or API error`, `status=${result.response.status} source=${result.response.headers.get("x-chat-source") ?? "none"}`);
  } finally {
    app.child.kill();
    providerMock.child.kill();
  }
}

if (failed) process.exitCode = 1;
