import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { ImageGenerationPanel } from '@sdkwork/image-pc-generation/react';
import { createFallbackModel } from '@sdkwork/models-pc-picker';
import { ChatMarkdownMessage } from '../markdown/ChatMarkdownMessage.tsx';
import type { PlaygroundAssetViewProps } from '../../playground-types.ts';
import { PlaygroundModalityWorkspace } from './playgroundModalityWorkspace.tsx';
import { PlaygroundModalityEmptyState } from './PlaygroundModalityEmptyState.tsx';

export function ImageView({
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
  const fallbackImageModel = createFallbackModel(
    'Image 3.0',
    t('playground.modelFallback.image'),
    '3.0',
    'images',
    t('common.status.pending'),
  );
  const placeholderKey = 'playground.imagePromptPlaceholder';

  return (
    <PlaygroundModalityWorkspace
      modality="image"
      bucket="images"
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
      fallbackModel={fallbackImageModel}
      emptyContent={(
        <PlaygroundModalityEmptyState
          icon={Sparkles}
          titleKey="playground.image.emptyTitle"
          descriptionKey="playground.image.emptyDescription"
        />
      )}
      renderOutputText={(outputText: string, streaming: boolean) => (
        <ChatMarkdownMessage content={outputText} tone="assistant" streaming={streaming} />
      )}
      generationPanel={(
        <ImageGenerationPanel
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
