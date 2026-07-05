import { useTranslation } from 'react-i18next';
import { Mic2 } from 'lucide-react';
import { AudioGenerationPanel } from '@sdkwork/audio-pc-generation/react';
import { createFallbackModel } from '@sdkwork/models-pc-picker';
import type { PlaygroundAssetViewProps } from '../../playground-types.ts';
import { PlaygroundModalityWorkspace } from './playgroundModalityWorkspace.tsx';
import { PlaygroundModalityEmptyState } from './PlaygroundModalityEmptyState.tsx';

export function AudioView({
  agentHistory,
  setPreviewItem,
  modelGroups,
  selectedModelId,
  setSelectedModelId,
  showModelMenu,
  setShowModelMenu,
  onSubmitGeneration,
  submitting,
  submitError,
}: PlaygroundAssetViewProps) {
  const { t } = useTranslation();
  const fallbackAudioModel = createFallbackModel(
    'Voice Pro',
    t('playground.modelFallback.audio'),
    'AUD',
    'audios',
    t('common.status.pending'),
  );
  const placeholderKey = 'playground.audioPromptPlaceholder';

  return (
    <PlaygroundModalityWorkspace
      modality="audio"
      bucket="audios"
      agentHistory={agentHistory}
      setPreviewItem={setPreviewItem}
      modelGroups={modelGroups}
      selectedModelId={selectedModelId}
      setSelectedModelId={setSelectedModelId}
      showModelMenu={showModelMenu}
      setShowModelMenu={setShowModelMenu}
      onSubmitGeneration={onSubmitGeneration}
      submitting={submitting}
      submitError={submitError}
      placeholderKey={placeholderKey}
      fallbackModel={fallbackAudioModel}
      emptyContent={(
        <PlaygroundModalityEmptyState
          icon={Mic2}
          titleKey="playground.audio.emptyTitle"
          descriptionKey="playground.audio.emptyDescription"
        />
      )}
      generationPanel={(
        <AudioGenerationPanel
          placeholderKey={placeholderKey}
          modelGroups={modelGroups}
          selectedModelId={selectedModelId}
          onSubmitGeneration={onSubmitGeneration}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    />
  );
}
