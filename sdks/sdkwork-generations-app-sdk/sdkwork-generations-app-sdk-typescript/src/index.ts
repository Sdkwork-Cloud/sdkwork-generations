import {
  createClient as createGeneratedGenerationsAppClient,
  SdkworkAppClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkAppConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkAppClient, createGeneratedGenerationsAppClient };
export type { SdkworkAppConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type SdkworkGenerationsAppClient = SdkworkAppClient;

export function createGenerationsAppClient(config: SdkworkAppConfig): SdkworkGenerationsAppClient {
  return createGeneratedGenerationsAppClient(config);
}

export function createClient(config: SdkworkAppConfig): SdkworkGenerationsAppClient {
  return createGenerationsAppClient(config);
}
