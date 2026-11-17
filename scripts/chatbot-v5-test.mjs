import { spawn } from "node:child_process";

const env = {
  ...process.env,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
};
const commands = [
  ["Build production app", ["node_modules/next/dist/bin/next", "build"]],
  ["Run V5 unit checks", ["scripts/chatbot-v5-unit.mjs"]],
  ["Run V5 mock integration", ["scripts/chatbot-v5-regression.mjs"]],
];

for (const [label, [entryPoint, ...args]] of commands) {
  console.log(`[v5] ${label}`);
  const child = spawn(process.execPath, [entryPoint, ...args], { cwd: process.cwd(), shell: false, stdio: "inherit", env });
  const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
  if (exitCode !== 0) {
    process.exitCode = exitCode;
    break;
  }
}
