import { useTranslation } from 'react-i18next';
import { Disc3 } from 'lucide-react';
import { MusicGenerationPanel } from '@sdkwork/music-pc-generation/react';
import { createFallbackModel } from '@sdkwork/models-pc-picker';
import type { PlaygroundAssetViewProps } from '../../playground-types.ts';
import { PlaygroundModalityWorkspace } from './playgroundModalityWorkspace.tsx';
import { PlaygroundModalityEmptyState } from './PlaygroundModalityEmptyState.tsx';

export function MusicView({
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
  const fallbackMusicModel = createFallbackModel(
    'Music 4.0',
    t('playground.modelFallback.music'),
    '4.0',
    'music',
    t('common.status.pending'),
  );
  const placeholderKey = 'playground.musicPromptPlaceholder';

  return (
    <PlaygroundModalityWorkspace
      modality="music"
      bucket="music"
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
      fallbackModel={fallbackMusicModel}
      emptyContent={(
        <PlaygroundModalityEmptyState
          icon={Disc3}
          titleKey="playground.music.emptyTitle"
          descriptionKey="playground.music.emptyDescription"
        />
      )}
      generationPanel={(
        <MusicGenerationPanel
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
