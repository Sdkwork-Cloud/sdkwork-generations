import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "sdkwork-generations-app-sdk-generated-typescript": path.resolve(
        __dirname,
        "../../sdks/sdkwork-generations-app-sdk/sdkwork-generations-app-sdk-typescript/generated/server-openapi/src/index.ts",
      ),
    },
  },
});
