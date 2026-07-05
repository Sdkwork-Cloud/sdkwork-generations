import { useTranslation } from 'react-i18next';
import { AudioWaveform } from 'lucide-react';
import { SfxGenerationPanel } from '@sdkwork/audio-pc-generation/react';
import { createFallbackModel } from '@sdkwork/models-pc-picker';
import type { PlaygroundAssetViewProps } from '../../playground-types.ts';
import { PlaygroundModalityWorkspace } from './playgroundModalityWorkspace.tsx';
import { PlaygroundModalityEmptyState } from './PlaygroundModalityEmptyState.tsx';

export function SfxView({
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
  const fallbackSfxModel = createFallbackModel(
    'SFX Engine',
    t('playground.modelFallback.sfx'),
    'SFX',
    'sfx',
    t('common.status.pending'),
  );
  const placeholderKey = 'playground.sfxPromptPlaceholder';

  return (
    <PlaygroundModalityWorkspace
      modality="sfx"
      bucket="sfx"
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
      fallbackModel={fallbackSfxModel}
      emptyContent={(
        <PlaygroundModalityEmptyState
          icon={AudioWaveform}
          titleKey="playground.sfx.emptyTitle"
          descriptionKey="playground.sfx.emptyDescription"
        />
      )}
      generationPanel={(
        <SfxGenerationPanel
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
