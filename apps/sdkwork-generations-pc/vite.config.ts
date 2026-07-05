import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    define: {
      'process.env.SDKWORK_ACCESS_TOKEN': JSON.stringify(env.SDKWORK_ACCESS_TOKEN ?? ''),
    },
          plugins: [react()],
  resolve: {
    alias: {
      "@sdkwork/generations-app-sdk": path.resolve(
        __dirname,
        "../../sdks/sdkwork-generations-app-sdk/sdkwork-generations-app-sdk-typescript/src/index.ts",
      ),
    },
  },
  };
});
