#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  process.stderr.write(`[generations_sdk_generate] ${message}\n`);
  process.exit(1);
}

function runNodeScript(relativeScriptPath, args) {
  const scriptPath = path.join(workspaceRoot, relativeScriptPath);
  const result = spawnSync("node", [scriptPath, ...args], {
    cwd: workspaceRoot,
    stdio: "inherit",
  });
  if (result.error) {
    fail(`failed to run ${relativeScriptPath}: ${result.error.message}`);
  }
  if (typeof result.status === "number" && result.status !== 0) {
    fail(`${relativeScriptPath} exited with code ${result.status}`);
  }
  if (result.signal) {
    fail(`${relativeScriptPath} terminated by signal ${result.signal}`);
  }
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const passthroughArgs = process.argv.slice(2);

runNodeScript("sdks/sdkwork-generations-app-sdk/bin/generate-sdk.mjs", passthroughArgs);
runNodeScript("sdks/sdkwork-generations-backend-sdk/bin/generate-sdk.mjs", passthroughArgs);

process.stdout.write("[generations_sdk_generate] generation completed\n");
