import type { ReactNode } from 'react';
import { DomainGenerationWorkspaceView } from '@sdkwork/generations-pc-workspace/generation-playground-workspace';
import type { DomainGenerationWorkspaceViewProps } from '@sdkwork/generations-pc-workspace/generation-playground-workspace';
import type {
  SdkworkGenerationAssetModality,
  SdkworkGenerationModelBucket,
} from '@sdkwork/generations-pc-workspace/generation-asset-config';

export type PlaygroundModalityWorkspaceProps = Omit<
  DomainGenerationWorkspaceViewProps,
  'modality' | 'bucket' | 'generationPanel'
> & {
  generationPanel: ReactNode;
};

export function PlaygroundModalityWorkspace({
  modality,
  bucket,
  generationPanel,
  ...props
}: PlaygroundModalityWorkspaceProps & {
  modality: SdkworkGenerationAssetModality;
  bucket: SdkworkGenerationModelBucket;
}) {
  return (
    <DomainGenerationWorkspaceView
      modality={modality}
      bucket={bucket}
      generationPanel={generationPanel}
      {...props}
    />
  );
}
