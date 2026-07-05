import { useTranslation } from 'react-i18next';
import { Clapperboard } from 'lucide-react';
import { VideoGenerationPanel } from '@sdkwork/video-pc-generation/react';
import { createFallbackModel } from '@sdkwork/models-pc-picker';
import type { PlaygroundAssetViewProps } from '../../playground-types.ts';
import { PlaygroundModalityWorkspace } from './playgroundModalityWorkspace.tsx';
import { PlaygroundModalityEmptyState } from './PlaygroundModalityEmptyState.tsx';

export function VideoView({
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
  const fallbackVideoModel = createFallbackModel(
    'Video 1.5',
    t('playground.modelFallback.video'),
    '1.5',
    'videos',
    t('common.status.pending'),
  );
  const placeholderKey = 'playground.videoPromptPlaceholder';

  return (
    <PlaygroundModalityWorkspace
      modality="video"
      bucket="videos"
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
      fallbackModel={fallbackVideoModel}
      emptyContent={(
        <PlaygroundModalityEmptyState
          icon={Clapperboard}
          titleKey="playground.video.emptyTitle"
          descriptionKey="playground.video.emptyDescription"
        />
      )}
      generationPanel={(
        <VideoGenerationPanel
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
