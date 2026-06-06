import { HttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';
import { GenerationsBackendApi } from './api/generations-backend';
export declare class SdkworkBackendClient {
    private httpClient;
    readonly generationsBackend: GenerationsBackendApi;
    constructor(config: SdkworkBackendConfig);
    setApiKey(apiKey: string): this;
    setAuthToken(token: string): this;
    setAccessToken(token: string): this;
    setTokenManager(manager: AuthTokenManager): this;
    get http(): HttpClient;
}
export declare function createClient(config: SdkworkBackendConfig): SdkworkBackendClient;
export default SdkworkBackendClient;
//# sourceMappingURL=sdk.d.ts.map