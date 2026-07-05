import { createFallbackModel, ModelPicker } from '@sdkwork/models-pc-picker';
import type { DomainGenerationWorkspaceViewProps } from './domainGenerationWorkspaceTypes';

type DomainGenerationWorkspaceSidebarProps = Pick<
  DomainGenerationWorkspaceViewProps,
  | 'modality'
  | 'bucket'
  | 'modelGroups'
  | 'selectedModelId'
  | 'setSelectedModelId'
  | 'showModelMenu'
  | 'setShowModelMenu'
  | 'fallbackModel'
  | 'generationPanel'
>;

export function DomainGenerationWorkspaceSidebar({
  modality,
  bucket,
  modelGroups,
  selectedModelId,
  setSelectedModelId,
  showModelMenu,
  setShowModelMenu,
  fallbackModel,
  generationPanel,
}: DomainGenerationWorkspaceSidebarProps) {
  const fallback = fallbackModel ?? createFallbackModel(
    'Generation Model',
    'Generation model',
    '1.0',
    bucket,
    'Pending',
  );

  const sidebarModalityClass =
    modality === 'sfx'
      ? 'sdkwork-playground-workspace-sidebar--sfx'
      : modality === 'image'
        ? 'sdkwork-playground-workspace-sidebar--image'
        : modality === 'video'
          ? 'sdkwork-playground-workspace-sidebar--video'
          : modality === 'music'
            ? 'sdkwork-playground-workspace-sidebar--music'
            : modality === 'audio'
              ? 'sdkwork-playground-workspace-sidebar--audio'
              : '';

  return (
    <div className={`sdkwork-playground-workspace-sidebar relative z-20 flex h-full min-h-0 flex-col overflow-hidden border-r ${sidebarModalityClass}`}>
      <div className={`relative z-30 shrink-0 overflow-visible ${modality === 'sfx' ? 'px-5 pt-5' : 'px-4 pt-6'}`}>
        <ModelPicker
          bucket={bucket}
          modelGroups={modelGroups}
          selectedModelId={selectedModelId}
          onSelectModel={setSelectedModelId}
          showModelMenu={showModelMenu}
          setShowModelMenu={setShowModelMenu}
          fallback={fallback}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {generationPanel}
      </div>
    </div>
  );
}
