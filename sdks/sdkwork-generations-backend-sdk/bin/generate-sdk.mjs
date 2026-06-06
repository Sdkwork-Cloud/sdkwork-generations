#!/usr/bin/env node
import {
  resolveFamilySdkRoot,
  runGenerationsSdkGenerator,
} from "../../../tools/generations_sdk_generator_runner.mjs";

runGenerationsSdkGenerator(
  {
    sdkName: "sdkwork-generations-backend-sdk",
    sdkOwner: "sdkwork-generations",
    apiAuthority: "sdkwork-generations-backend-api",
    sdkRoot: resolveFamilySdkRoot(import.meta.url),
    sdkType: "backend",
    apiPrefix: "/backend/v3/api",
    defaultBaseUrl: "http://127.0.0.1:18090",
    defaultOpenapiFile: "sdkwork-generations-backend-api.openapi.json",
    sdkDependencies: [],
  },
  process.argv.slice(2),
);
