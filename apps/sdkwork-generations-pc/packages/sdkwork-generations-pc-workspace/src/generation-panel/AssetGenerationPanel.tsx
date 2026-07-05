import { ImageGenerationPanel } from '@sdkwork/image-pc-generation/react';
import { MusicGenerationPanel } from '@sdkwork/music-pc-generation/react';
import { VideoGenerationPanel } from '@sdkwork/video-pc-generation/react';
import { AudioGenerationPanel, SfxGenerationPanel, SfxGenerationControls } from '@sdkwork/audio-pc-generation/react';
import type {
  AssetGenerationSubmitInput,
  AssetGenerationTargetType,
  AssetGenerationModelGroup,
} from './types';

export { SfxGenerationControls };

export function AssetGenerationPanel({
  modality,
  placeholderKey,
  modelGroups,
  selectedModelId,
  onSubmitGeneration,
  submitting,
  submitError,
}: {
  modality: AssetGenerationTargetType;
  placeholderKey: string;
  modelGroups: AssetGenerationModelGroup[];
  selectedModelId: string;
  onSubmitGeneration: (input: AssetGenerationSubmitInput) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}) {
  const panelProps = {
    placeholderKey,
    modelGroups,
    selectedModelId,
    onSubmitGeneration: onSubmitGeneration as (input: AssetGenerationSubmitInput) => Promise<void>,
    submitting,
    submitError,
  };

  switch (modality) {
    case 'image':
      return <ImageGenerationPanel {...panelProps} />;
    case 'music':
      return <MusicGenerationPanel {...panelProps} />;
    case 'video':
      return <VideoGenerationPanel {...panelProps} />;
    case 'audio':
      return <AudioGenerationPanel {...panelProps} />;
    case 'sfx':
      return <SfxGenerationPanel {...panelProps} />;
    default:
      return null;
  }
}
