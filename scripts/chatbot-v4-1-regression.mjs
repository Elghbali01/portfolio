import { spawn } from "node:child_process";

const port = 3218;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  shell: false,
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(baseUrl)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Production server did not start.");
}

async function ask(message) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, history: [], preferredLanguage: "en" }),
  });
  const payload = (response.headers.get("content-type") ?? "").includes("application/json")
    ? await response.json()
    : null;
  return { response, payload };
}

const greetings = [
  "salam", "Salaam", "salaaaaaam", "saaaaaaaaalam", "slm", "salam 3likom",
  "bonjour", "bonjouuuuur", "bonjouuuuuuuuuur", "bjr", "bjour", "slt", "saluuuuut",
  "hello", "helloooo", "hi", "hiiiiiiii", "hey", "heyyyyyyy",
  "سلام", "السلام عليكم", "مرحبا", "أهلا", "bonsoir", "bsr", "coucou", "yo", "labas", "kidayr", "ki dayr",
];
const falsePositives = ["salaires", "hello world project", "hi-tech architecture"];
const semanticGreetings = new Set(["slm"]);

let failed = 0;
try {
  await waitForServer();
  for (const greeting of greetings) {
    const { response, payload } = await ask(greeting);
    const expectedSource = semanticGreetings.has(greeting) ? "semantic-local" : "local";
    const ok = response.ok
      && response.headers.get("x-chat-source") === expectedSource
      && response.headers.get("x-chat-intent") === "GREETING"
      && typeof payload?.answer === "string";
    console.log(`${ok ? "PASS" : "FAIL"} greeting: ${greeting}`);
    if (!ok) failed += 1;
  }
  for (const input of falsePositives) {
    const { response } = await ask(input);
    const ok = response.headers.get("x-chat-intent") !== "GREETING";
    console.log(`${ok ? "PASS" : "FAIL"} anti-false-positive: ${input}`);
    if (!ok) failed += 1;
  }
} finally {
  server.kill();
}

if (failed) process.exitCode = 1;
