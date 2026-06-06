#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OFFICIAL_LANGUAGE_ORDER = ["typescript", "rust", "java", "python", "go"];
const DEFAULT_LANGUAGE = "typescript";
const FIXED_SDK_VERSION = "0.1.0";
const STANDARD_PROFILE = "sdkwork-v3";
const STANDARD_SDK_GENERATOR_ROOT =
  "D:\\javasource\\spring-ai-plus\\sdk\\sdkwork-sdk-generator";
const STANDARD_SDK_GENERATOR_BIN = path.join(
  STANDARD_SDK_GENERATOR_ROOT,
  "bin",
  "sdkgen.js",
);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");

function fail(sdkName, message) {
  process.stderr.write(`[${sdkName}] ${message}\n`);
  process.exit(1);
}

function parseLanguages(raw, sdkName) {
  const values = raw.flatMap((item) => String(item || "").split(","));
  const normalized = [];
  for (const value of values) {
    const language = value.trim().toLowerCase();
    if (!language) {
      continue;
    }
    if (!OFFICIAL_LANGUAGE_ORDER.includes(language)) {
      fail(sdkName, `unsupported language: ${language}`);
    }
    if (!normalized.includes(language)) {
      normalized.push(language);
    }
  }
  return OFFICIAL_LANGUAGE_ORDER.filter((language) => normalized.includes(language));
}

function parseArgs(argv, defaultBaseUrl, sdkName) {
  const parsed = {
    allLanguages: false,
    languages: [],
    baseUrl: defaultBaseUrl,
    input: null,
    passthrough: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--all-languages") {
      parsed.allLanguages = true;
      continue;
    }
    if (current === "--language") {
      parsed.languages.push(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (current.startsWith("--language=")) {
      parsed.languages.push(current.slice("--language=".length));
      continue;
    }
    if (current === "--base-url") {
      parsed.baseUrl = argv[index + 1] || defaultBaseUrl;
      index += 1;
      continue;
    }
    if (current === "--input") {
      parsed.input = argv[index + 1] || "";
      index += 1;
      continue;
    }
    if (current.startsWith("--input=")) {
      parsed.input = current.slice("--input=".length);
      continue;
    }
    if (current === "--") {
      parsed.passthrough.push(...argv.slice(index + 1));
      break;
    }
    parsed.passthrough.push(current);
  }

  if (!parsed.baseUrl || !parsed.baseUrl.trim()) {
    fail(sdkName, "base URL cannot be empty");
  }
  return parsed;
}

function isOfficialGeneratorPath(candidate) {
  const normalized = path.resolve(candidate).toLowerCase();
  const standardRoot = path.resolve(STANDARD_SDK_GENERATOR_ROOT).toLowerCase();
  return normalized.startsWith(`${standardRoot}${path.sep}`) || normalized === standardRoot;
}

export function resolveSdkGeneratorInvocation() {
  const configured = process.env.SDKWORK_SDK_GENERATOR_BIN?.trim();
  if (configured) {
    if (!isOfficialGeneratorPath(configured)) {
      throw new Error(
        `SDKWORK_SDK_GENERATOR_BIN must point to ${STANDARD_SDK_GENERATOR_ROOT}; received ${configured}`,
      );
    }
    if (configured.endsWith(".js") || configured.endsWith(".mjs") || configured.endsWith(".cjs")) {
      return {
        command: "node",
        prefixArgs: [configured],
        shell: false,
        generatorName: "sdkwork-sdk-generator",
      };
    }
    return {
      command: configured,
      prefixArgs: [],
      shell: process.platform === "win32",
      generatorName: "sdkwork-sdk-generator",
    };
  }

  if (existsSync(STANDARD_SDK_GENERATOR_BIN)) {
    return {
      command: "node",
      prefixArgs: [STANDARD_SDK_GENERATOR_BIN],
      shell: false,
      generatorName: "sdkwork-sdk-generator",
    };
  }

  throw new Error(
    `standard SDK generator not found: ${STANDARD_SDK_GENERATOR_BIN}. Generations SDK family generation must use ${STANDARD_SDK_GENERATOR_ROOT}.`,
  );
}

function collectOperations(openapiDocument) {
  const operations = [];
  for (const [pathKey, pathItem] of Object.entries(openapiDocument.paths || {})) {
    for (const [methodName, operation] of Object.entries(pathItem || {})) {
      if (!["get", "put", "post", "patch", "delete", "head", "options", "trace"].includes(methodName)) {
        continue;
      }
      operations.push({
        operationId: operation?.operationId || `${methodName}.${pathKey}`,
        method: methodName.toUpperCase(),
        path: pathKey,
      });
    }
  }
  operations.sort((left, right) => left.operationId.localeCompare(right.operationId));
  return operations;
}

function writeFamilyManifest({ family, openapiPath, generatorName, baseUrl }) {
  const openapiDocument = JSON.parse(readFileSync(openapiPath, "utf8"));
  const operations = collectOperations(openapiDocument);
  const generatedPackages = Object.fromEntries(OFFICIAL_LANGUAGE_ORDER.map((language) => [
    language,
    {
      language,
      packageName: `${family.sdkName}-generated-${language}`,
      generatedOutput: `${family.sdkName}-${language}/generated/server-openapi`,
    },
  ]));
  const manifest = {
    schemaVersion: 1,
    sdkName: family.sdkName,
    sdkOwner: family.sdkOwner,
    sdkFamily: family.sdkName,
    apiAuthority: family.apiAuthority,
    sdkType: family.sdkType,
    apiPrefix: family.apiPrefix,
    generationInputSpec: toPosixPath(path.relative(family.sdkRoot, openapiPath)),
    generatedPackages,
    sdkDependencies: family.sdkDependencies || [],
    generatorName,
    baseUrl,
    standardProfile: STANDARD_PROFILE,
    fixedSdkVersion: FIXED_SDK_VERSION,
    ownerOnlyOperationCount: operations.length,
    managedBy: "tools/generations_sdk_generator_runner.mjs",
  };
  writeFileSync(
    path.join(family.sdkRoot, "sdk-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
}

function removeStaleTrackingFiles(outputPath) {
  for (const fileName of ["sdk-manifest.json", "source-openapi.json"]) {
    const filePath = path.join(outputPath, fileName);
    if (existsSync(filePath)) {
      rmSync(filePath, { force: true });
    }
  }
}

function writeSourceOpenapi({ openapiPath, outputPath }) {
  const openapiDocument = JSON.parse(readFileSync(openapiPath, "utf8"));
  writeFileSync(
    path.join(outputPath, "source-openapi.json"),
    `${JSON.stringify(openapiDocument, null, 2)}\n`,
    "utf8",
  );
}

function toPosixPath(value) {
  return value.replace(/\\/g, "/");
}

export function runGenerationsSdkGenerator(family, argv) {
  const sdkName = family.sdkName;
  const args = parseArgs(argv, family.defaultBaseUrl, sdkName);
  const openapiPath = args.input
    ? path.resolve(workspaceRoot, args.input)
    : path.join(family.sdkRoot, "openapi", family.defaultOpenapiFile);

  if (!existsSync(openapiPath)) {
    fail(sdkName, `openapi file not found: ${openapiPath}`);
  }

  const languages = args.allLanguages
    ? OFFICIAL_LANGUAGE_ORDER
    : parseLanguages(args.languages.length > 0 ? args.languages : [DEFAULT_LANGUAGE], sdkName);

  let generator;
  try {
    generator = resolveSdkGeneratorInvocation();
  } catch (error) {
    fail(sdkName, error instanceof Error ? error.message : String(error));
  }

  for (const language of languages) {
    const outputPath = path.join(
      family.sdkRoot,
      `${sdkName}-${language}`,
      "generated",
      "server-openapi",
    );
    mkdirSync(outputPath, { recursive: true });
    const commandArgs = [
      "generate",
      "--input",
      openapiPath,
      "--output",
      outputPath,
      "--name",
      sdkName,
      "--type",
      family.sdkType,
      "--language",
      language,
      "--base-url",
      args.baseUrl,
      "--api-prefix",
      family.apiPrefix,
      "--fixed-sdk-version",
      FIXED_SDK_VERSION,
      "--sdk-root",
      family.sdkRoot,
      "--sdk-name",
      sdkName,
      "--package-name",
      `${sdkName}-generated-${language}`,
      "--standard-profile",
      STANDARD_PROFILE,
      ...args.passthrough,
    ];

    const result = spawnSync(generator.command, [...generator.prefixArgs, ...commandArgs], {
      cwd: family.sdkRoot,
      stdio: "inherit",
      shell: generator.shell,
    });
    if (result.error) {
      fail(sdkName, `failed to start generator for ${language}: ${result.error.message}`);
    }
    if (typeof result.status === "number" && result.status !== 0) {
      fail(sdkName, `generator failed for ${language} with exit code ${result.status}`);
    }
    if (result.signal) {
      fail(sdkName, `generator terminated by signal ${result.signal}`);
    }
    removeStaleTrackingFiles(outputPath);
    writeSourceOpenapi({ openapiPath, outputPath });
  }

  writeFamilyManifest({
    family,
    openapiPath,
    generatorName: generator.generatorName,
    baseUrl: args.baseUrl,
  });
}

export function resolveFamilySdkRoot(importMetaUrl) {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), "..");
}
