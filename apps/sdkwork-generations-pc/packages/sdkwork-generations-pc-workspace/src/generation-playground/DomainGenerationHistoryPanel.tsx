import { useTranslation } from 'react-i18next';
import { GenerationHistoryWorkspaceView } from '../generation-history-ui/GenerationHistoryWorkspaceView';
import {
  createPlaygroundGenerationHistoryPresentation,
  PLAYGROUND_GENERATION_HISTORY_KIND_TABS,
} from './playgroundGenerationHistoryPresentation';
import type { DomainGenerationWorkspaceViewProps } from './domainGenerationWorkspaceTypes';

type DomainGenerationHistoryPanelProps = Pick<
  DomainGenerationWorkspaceViewProps,
  | 'agentHistory'
  | 'setPreviewItem'
  | 'modality'
  | 'historyTabs'
  | 'resolveTabLabel'
  | 'resolveTypeLabel'
  | 'resolveTypeIcon'
  | 'renderOutputText'
  | 'emptyContent'
>;

export function DomainGenerationHistoryPanel({
  agentHistory,
  setPreviewItem,
  modality,
  historyTabs = PLAYGROUND_GENERATION_HISTORY_KIND_TABS,
  resolveTabLabel,
  resolveTypeLabel,
  resolveTypeIcon,
  renderOutputText,
  emptyContent,
}: DomainGenerationHistoryPanelProps) {
  const { t } = useTranslation();
  const presentation = createPlaygroundGenerationHistoryPresentation(t);

  return (
    <GenerationHistoryWorkspaceView
      items={agentHistory}
      setPreviewItem={setPreviewItem}
      modality={modality}
      tabs={historyTabs}
      resolveTabLabel={resolveTabLabel ?? presentation.resolveTabLabel}
      resolveTypeLabel={resolveTypeLabel ?? presentation.resolveTypeLabel}
      resolveTypeIcon={resolveTypeIcon ?? presentation.resolveTypeIcon}
      renderOutputText={renderOutputText}
      emptyContent={emptyContent ?? presentation.emptyContent}
    />
  );
}
