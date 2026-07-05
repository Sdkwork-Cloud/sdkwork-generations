export type AssetWorkspaceKind = 'all' | 'image' | 'video' | 'music' | 'audio' | 'speech' | 'sfx' | (string & {});

export interface AssetWorkspaceKindTab {
  id: AssetWorkspaceKind;
  labelKey?: string;
  label?: string;
}

/** Default generation-workspace tabs (全部 / 图像 / 视频 / 音乐 / 音频 / 音效). */
export const GENERATION_ASSET_WORKSPACE_KIND_TABS: readonly AssetWorkspaceKindTab[] = [
  { id: 'all', labelKey: 'workspaceKind_all' },
  { id: 'image', labelKey: 'workspaceKind_image' },
  { id: 'video', labelKey: 'workspaceKind_video' },
  { id: 'music', labelKey: 'workspaceKind_music' },
  { id: 'audio', labelKey: 'workspaceKind_audio' },
  { id: 'sfx', labelKey: 'workspaceKind_sfx' },
] as const;

export interface AssetWorkspaceKindMatchOptions {
  /** When set, item types matching this predicate count as `image`. */
  isImageType?: (type: string) => boolean;
}

export function filterItemsByAssetWorkspaceKind<T>(
  items: readonly T[],
  activeKind: AssetWorkspaceKind,
  resolveItemType: (item: T) => string,
  options?: AssetWorkspaceKindMatchOptions,
): T[] {
  if (activeKind === 'all') {
    return [...items];
  }

  return items.filter((item) => {
    const type = resolveItemType(item);
    if (activeKind === 'image') {
      return options?.isImageType?.(type) ?? type === 'image';
    }
    return type === activeKind;
  });
}

export function resolveAssetWorkspaceKindFromModality(
  modality: string,
  agentModality = 'agent',
): AssetWorkspaceKind {
  return modality === agentModality ? 'all' : modality;
}

export type GenerationWorkspaceKind = AssetWorkspaceKind;
export type GenerationWorkspaceKindTab = AssetWorkspaceKindTab;
export const GENERATION_WORKSPACE_KIND_TABS = GENERATION_ASSET_WORKSPACE_KIND_TABS;
export const filterItemsByGenerationWorkspaceKind = filterItemsByAssetWorkspaceKind;
export const resolveGenerationWorkspaceKindFromModality = resolveAssetWorkspaceKindFromModality;
export type GenerationWorkspaceKindMatchOptions = AssetWorkspaceKindMatchOptions;
