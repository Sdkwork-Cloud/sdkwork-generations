import { GenerationPage, sdkworkGenerationService } from "@sdkwork/generations-pc-workspace/react";

export function App() {
  return (
    <GenerationPage
      service={sdkworkGenerationService}
    />
  );
}
