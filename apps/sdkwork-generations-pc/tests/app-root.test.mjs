import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(testDir, "..");

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(appRoot, relativePath), "utf8"));
}

test("sdkwork-generations-pc composes the user-facing workspace package", () => {
  const appManifest = readJson("sdkwork.app.config.json");
  const appPackage = readJson("package.json");
  const workspacePackage = readJson("packages/sdkwork-generations-pc-workspace/package.json");

  assert.equal(appManifest.app.key, "sdkwork-generations-pc");
  assert.equal(appPackage.dependencies["@sdkwork/generations-pc-workspace"], "workspace:*");
  assert.equal(workspacePackage.name, "@sdkwork/generations-pc-workspace");
  assert.equal(workspacePackage.sdkwork.surface, "app");
  assert.equal(workspacePackage.sdkwork.domain, "intelligence");
  assert.equal(workspacePackage.sdkwork.capability, "workspace");
});
