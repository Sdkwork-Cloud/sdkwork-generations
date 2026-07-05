import { useTranslation } from 'react-i18next';
import {
  createPlaygroundGenerationHistoryPresentation,
  DomainGenerationHistoryPanel,
  PLAYGROUND_GENERATION_HISTORY_KIND_TABS,
} from '@sdkwork/generations-pc-workspace/generation-playground-workspace';
import { ChatMarkdownMessage } from '../markdown/ChatMarkdownMessage.tsx';
import type { PlaygroundHistoryItem, PlaygroundPreviewSetter } from '../../playground-types.ts';

export function SharedHistoryView({
  agentHistory,
  setPreviewItem,
  modality,
}: {
  agentHistory: PlaygroundHistoryItem[];
  setPreviewItem: PlaygroundPreviewSetter;
  modality: string;
}) {
  const { t } = useTranslation();
  const presentation = createPlaygroundGenerationHistoryPresentation(t);

  return (
    <DomainGenerationHistoryPanel
      agentHistory={agentHistory}
      setPreviewItem={setPreviewItem}
      modality={modality}
      historyTabs={PLAYGROUND_GENERATION_HISTORY_KIND_TABS}
      resolveTabLabel={presentation.resolveTabLabel}
      resolveTypeLabel={presentation.resolveTypeLabel}
      resolveTypeIcon={presentation.resolveTypeIcon}
      renderOutputText={(outputText, streaming) => (
        <ChatMarkdownMessage content={outputText} tone="assistant" streaming={streaming} />
      )}
      emptyContent={presentation.emptyContent}
    />
  );
}
