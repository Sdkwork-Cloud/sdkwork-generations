import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isSdkworkGenerationImageHistoryType,
  type SdkworkGenerationHistoryItem,
  type SdkworkGenerationHistoryType,
} from '@sdkwork/generations-pc-workspace/generation-history';
import { GenerationWorkspacePanel } from '../generation-workspace/GenerationWorkspacePanel';
import { filterItemsByAssetWorkspaceKind, type AssetWorkspaceKindTab } from '../generation-workspace/generationWorkspaceKind';
import { useAssetWorkspaceKind } from '../generation-workspace/useGenerationWorkspaceKind';
import {
  GenerationHistoryItemView,
  type GenerationHistoryPreviewSetter,
} from './GenerationHistoryMessageItems';

export const DEFAULT_GENERATION_HISTORY_KIND_TABS: readonly AssetWorkspaceKindTab[] = [
  { id: 'all', labelKey: 'workspaceKind_all' },
  { id: 'image', labelKey: 'workspaceKind_image' },
  { id: 'video', labelKey: 'workspaceKind_video' },
  { id: 'music', labelKey: 'workspaceKind_music' },
  { id: 'audio', labelKey: 'workspaceKind_audio' },
  { id: 'sfx', labelKey: 'workspaceKind_sfx' },
] as const;

export interface GenerationHistoryWorkspaceViewProps {
  items: SdkworkGenerationHistoryItem[];
  setPreviewItem: GenerationHistoryPreviewSetter;
  modality: string;
  tabs?: readonly AssetWorkspaceKindTab[];
  resolveTabLabel?: (tab: AssetWorkspaceKindTab) => string;
  resolveTypeLabel?: (item: SdkworkGenerationHistoryItem) => string;
  resolveTypeIcon?: (item: SdkworkGenerationHistoryItem) => ReactNode;
  renderOutputText?: (outputText: string, streaming: boolean) => ReactNode;
  emptyContent?: ReactNode;
}

export function GenerationHistoryWorkspaceView({
  items,
  setPreviewItem,
  modality,
  tabs = DEFAULT_GENERATION_HISTORY_KIND_TABS,
  resolveTabLabel,
  resolveTypeLabel,
  resolveTypeIcon,
  renderOutputText,
  emptyContent,
}: GenerationHistoryWorkspaceViewProps) {
  const { t } = useTranslation();
  const { activeKind, setActiveKind } = useAssetWorkspaceKind(modality);

  const filteredHistory = useMemo(
    () =>
      filterItemsByAssetWorkspaceKind(
        items,
        activeKind,
        (item) => item.type,
        {
          isImageType: (type) =>
            isSdkworkGenerationImageHistoryType(type as SdkworkGenerationHistoryType),
        },
      ),
    [items, activeKind],
  );

  return (
    <GenerationWorkspacePanel
      tabs={tabs}
      activeKind={activeKind}
      onActiveKindChange={setActiveKind}
      resolveTabLabel={resolveTabLabel ?? ((tab) => t(tab.labelKey ?? tab.label ?? tab.id))}
      isEmpty={filteredHistory.length === 0}
      emptyContent={
        emptyContent ?? (
          <div className="sdkwork-generation-history-empty-card w-full max-w-lg px-6 py-16 text-center text-sm">
            {t('generationHistory_listEmpty')}
          </div>
        )
      }
    >
      {filteredHistory.map((item, index) => {
        const isNewDate = index === 0 || filteredHistory[index - 1]?.date !== item.date;

        return (
          <div key={item.id} className="flex flex-col gap-4">
            {isNewDate ? <h3 className="sdkwork-generation-history-date mb-2 pt-4 text-xl font-bold">{item.date}</h3> : null}
            <GenerationHistoryItemView
              item={item}
              setPreviewItem={setPreviewItem}
              resolveTypeLabel={resolveTypeLabel}
              resolveTypeIcon={resolveTypeIcon}
              renderOutputText={renderOutputText}
            />
          </div>
        );
      })}
    </GenerationWorkspacePanel>
  );
}
