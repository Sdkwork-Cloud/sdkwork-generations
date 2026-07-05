import { DomainGenerationHistoryPanel } from './DomainGenerationHistoryPanel';
import { DomainGenerationWorkspaceSidebar } from './DomainGenerationWorkspaceSidebar';
import type { DomainGenerationWorkspaceViewProps } from './domainGenerationWorkspaceTypes';

export function DomainGenerationWorkspaceView({
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
  modality,
  bucket,
  placeholderKey,
  fallbackModel,
  generationPanel,
  historyTabs,
  resolveTabLabel,
  resolveTypeLabel,
  resolveTypeIcon,
  renderOutputText,
  emptyContent,
}: DomainGenerationWorkspaceViewProps) {
  return (
    <div className="sdkwork-generation-workspace-view relative z-10 flex h-full min-h-0 w-full flex-row overflow-hidden">
      <DomainGenerationWorkspaceSidebar
        modality={modality}
        bucket={bucket}
        modelGroups={modelGroups}
        selectedModelId={selectedModelId}
        setSelectedModelId={setSelectedModelId}
        showModelMenu={showModelMenu}
        setShowModelMenu={setShowModelMenu}
        fallbackModel={fallbackModel}
        generationPanel={generationPanel}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DomainGenerationHistoryPanel
          agentHistory={agentHistory}
          setPreviewItem={setPreviewItem}
          modality={modality}
          historyTabs={historyTabs}
          resolveTabLabel={resolveTabLabel}
          resolveTypeLabel={resolveTypeLabel}
          resolveTypeIcon={resolveTypeIcon}
          renderOutputText={renderOutputText}
          emptyContent={emptyContent}
        />
      </div>
    </div>
  );
}
