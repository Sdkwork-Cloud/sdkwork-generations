import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(packageRoot, "../..");

export default defineConfig({
  resolve: {
    alias: {
      react: path.join(appRoot, "node_modules/react"),
      "react-dom": path.join(appRoot, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/vitest.setup.ts"],
  },
});
