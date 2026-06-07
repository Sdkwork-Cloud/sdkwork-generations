import { createSdkworkGenerationService } from "@sdkwork/generations-pc-workspace";
import { SdkworkGenerationPage } from "@sdkwork/generations-pc-workspace/react";
import { createGenerationsPcSdkClients } from "./bootstrap/sdkClients";

const sdkClients = createGenerationsPcSdkClients();
const sdkworkGenerationService = createSdkworkGenerationService({
  includeSampleRuns: false,
  sdkClients,
});

export function App() {
  return (
    <SdkworkGenerationPage
      service={sdkworkGenerationService}
    />
  );
}
