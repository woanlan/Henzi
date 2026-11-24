import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PORT = String(process.env.PORT || 3003);
const BACKEND_PORT = String(process.env.BACKEND_PORT || 3001);
const BACKEND_ORIGIN = `http://127.0.0.1:${BACKEND_PORT}`;
const INTERNAL_API_URL = `${BACKEND_ORIGIN}/api`;

const isWin = process.platform === "win32";

const waitForBackend = async (maxMs = 15000) => {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${INTERNAL_API_URL}/health`, {
        signal: AbortSignal.timeout(1200),
      });
      if (res.ok) {
        console.log(`✓ Internal Backend ready at ${INTERNAL_API_URL}`);
        return true;
      }
    } catch {
      // Backend still booting
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  console.warn("⚠ Timed out waiting for internal Backend health; continuing startup...");
  return false;
};

const backendDir = path.join(__dirname, "backend");
const frontendDir = path.join(__dirname, "frontend");

const backendProc = spawn(process.execPath, ["src/server.js"], {
  cwd: backendDir,
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: BACKEND_PORT,
    BACKEND_PORT,
  },
});

backendProc.on("exit", (code) => {
  console.error(`Backend process exited with code ${code}`);
  process.exit(code ?? 1);
});

await waitForBackend();

const nextBin = path.join(
  frontendDir,
  "node_modules",
  ".bin",
  isWin ? "next.cmd" : "next"
);

const frontendProc = spawn(
  nextBin,
  ["start", "-H", "0.0.0.0", "-p", PUBLIC_PORT],
  {
    cwd: frontendDir,
    stdio: "inherit",
    shell: isWin,
    env: {
      ...process.env,
      PORT: PUBLIC_PORT,
      BACKEND_ORIGIN,
      INTERNAL_API_URL,
    },
  }
);

frontendProc.on("exit", (code) => {
  backendProc.kill("SIGTERM");
  process.exit(code ?? 0);
});

const shutdown = (signal) => {
  frontendProc.kill(signal);
  backendProc.kill(signal);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
