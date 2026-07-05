import type { ReactNode } from 'react';
import { Bot, FileAudio, Headphones, Image as ImageIcon, Music, Video } from 'lucide-react';
import { getSdkworkGenerationPreviewKind } from '@sdkwork/generations-pc-workspace/generation-history';
import type { SdkworkGenerationHistoryItem } from '@sdkwork/generations-pc-workspace/generation-history';
import type { AssetWorkspaceKindTab } from '../utils/assetWorkspaceKind';

export const PLAYGROUND_GENERATION_HISTORY_KIND_TABS: readonly AssetWorkspaceKindTab[] = [
  { id: 'all', labelKey: 'playground.history.filter.all' },
  { id: 'image', labelKey: 'playground.history.filter.images' },
  { id: 'video', labelKey: 'playground.history.filter.videos' },
  { id: 'music', labelKey: 'common.modality.music' },
  { id: 'audio', labelKey: 'common.modality.audio' },
  { id: 'sfx', labelKey: 'common.modality.sfx' },
] as const;

export interface PlaygroundGenerationHistoryPresentation {
  resolveTabLabel: (tab: AssetWorkspaceKindTab) => string;
  resolveTypeLabel: (item: SdkworkGenerationHistoryItem) => string;
  resolveTypeIcon: (item: SdkworkGenerationHistoryItem) => ReactNode;
  emptyContent: ReactNode;
}

export function createPlaygroundGenerationHistoryPresentation(
  t: (key: string) => string,
): PlaygroundGenerationHistoryPresentation {
  return {
    resolveTabLabel: (tab) => t(tab.labelKey ?? tab.label ?? tab.id),
    resolveTypeLabel: (item) => {
      const previewKind = getSdkworkGenerationPreviewKind(item.type);
      if (previewKind === 'text') return t('playground.input.type.agent');
      if (previewKind === 'image') return t('playground.input.type.image');
      if (previewKind === 'video') return t('playground.input.type.video');
      if (item.type === 'music') return t('playground.input.type.music');
      if (item.type === 'audio') return t('playground.input.type.audio');
      return t('playground.input.type.sfx');
    },
    resolveTypeIcon: (item) => {
      const previewKind = getSdkworkGenerationPreviewKind(item.type);
      if (previewKind === 'text') return <Bot className="h-3.5 w-3.5" />;
      if (previewKind === 'image') return <ImageIcon className="h-3.5 w-3.5" />;
      if (previewKind === 'video') return <Video className="h-3.5 w-3.5" />;
      if (item.type === 'music') return <Music className="h-3.5 w-3.5" />;
      if (item.type === 'audio') return <Headphones className="h-3.5 w-3.5" />;
      return <FileAudio className="h-3.5 w-3.5" />;
    },
    emptyContent: (
      <div className="sdkwork-asset-workspace-empty-card w-full max-w-lg px-6 py-16 text-center text-sm">
        {t('playground.history.empty')}
      </div>
    ),
  };
}
