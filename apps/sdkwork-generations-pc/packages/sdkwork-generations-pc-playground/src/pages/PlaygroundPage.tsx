import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlaygroundHost } from '../PlaygroundHostContext.tsx';
import { PlaygroundHostProvider } from '../PlaygroundHostContext.tsx';
import {
  getSdkworkGenerationModelBucket,
} from '@sdkwork/generations-pc-workspace/generation-asset-config';
import {
  appendSdkworkGenerationArtifactToHistoryItem,
  createSdkworkGenerationPendingHistoryItem,
  getSdkworkGenerationPreviewKind,
  mapSdkworkGenerationHistoryTypeToModality,
  readSdkworkGenerationMediaThumb,
  readSdkworkGenerationMediaUrl,
  restoreSdkworkGenerationSerializedConfigFromHistoryItem,
} from '@sdkwork/generations-pc-workspace/generation-history';
import {
  Activity,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileAudio,
  FolderOpen,
  Headphones,
  MessageSquare,
  MoreHorizontal,
  Music,
  Search,
  Share2,
  Video,
  X,
} from 'lucide-react';
import { AgentView } from '../components/views/AgentView';
import { ImageView } from '../components/views/ImageView';
import { VideoView } from '../components/views/VideoView';
import { MusicView } from '../components/views/MusicView';
import { AudioView } from '../components/views/AudioView';
import { SfxView } from '../components/views/SfxView';
import { AssetView } from '../components/views/AssetView';
import { ChatMarkdownMessage } from '../components/markdown/ChatMarkdownMessage.tsx';
import { IconSidebarItem } from '../components/IconSidebarItem';
import { PlaygroundImageFilledIcon, PlaygroundImageOutlineIcon } from '../components/playgroundRailIcons.tsx';
import { getDeterministicWaveBarStyle } from '@sdkwork/generations-pc-workspace/generation-history-ui';
import type { PlaygroundPageProps } from '../playground-host.ts';
import type { PlaygroundHistoryItem, PlaygroundModelBucket, PlaygroundModelGroup } from '../playground-types.ts';
import type {
  PlaygroundGenerationConfig,
  PlaygroundGenerationSubmitInput,
  PlaygroundGenerationTargetType,
} from '../playground-types.ts';
import {
  PLAYGROUND_MODALITY_ROUTES,
  type GenerationModality,
  type Modality,
} from '../playground-modality.ts';

type PlaygroundRouteModality = Exclude<Modality, 'package'>;
type PlaygroundAssetRouteModality = Exclude<PlaygroundRouteModality, 'agent' | 'chat'>;

const DEFAULT_FILTER = 'all';

const typeOptions = [
  { id: DEFAULT_FILTER, labelKey: 'playground.history.filter.all' },
  { id: 'image', labelKey: 'common.modality.image' },
  { id: 'video', labelKey: 'common.modality.video' },
  { id: 'music', labelKey: 'common.modality.music' },
  { id: 'audio', labelKey: 'common.modality.audio' },
  { id: 'sfx', labelKey: 'common.modality.sfx' },
] as const;

const timeOptions = [
  { id: DEFAULT_FILTER, labelKey: 'playground.history.filter.all' },
  { id: '7d', labelKey: 'playground.filter.last7Days' },
  { id: '30d', labelKey: 'playground.filter.last30Days' },
  { id: '90d', labelKey: 'playground.filter.last90Days' },
] as const;

function isImageItem(item: PlaygroundHistoryItem) {
  return getSdkworkGenerationPreviewKind(item.type) === 'image';
}

function toModelBucket(value: Modality): PlaygroundModelBucket | null {
  if (value === 'agent' || value === 'chat') {
    return 'llms';
  }
  if (value === 'package' || value === 'assets') {
    return null;
  }
  return getSdkworkGenerationModelBucket(value);
}

function readFirstModelId(groups: PlaygroundModelGroup[], bucket: PlaygroundModelBucket): string {
  for (const group of groups) {
    const first = group[bucket][0];
    if (first) {
      return first.id;
    }
  }
  return '';
}

function hasSelectedModel(groups: PlaygroundModelGroup[], bucket: PlaygroundModelBucket, selectedModelId: string): boolean {
  return groups.some((group) => group[bucket].some((model) => model.id === selectedModelId));
}

function isWithinTimeFilter(item: PlaygroundHistoryItem, timeFilter: string): boolean {
  if (timeFilter === DEFAULT_FILTER) {
    return true;
  }

  const days = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : timeFilter === '90d' ? 90 : null;
  if (days === null) {
    return true;
  }

  const timestamp = Date.parse(item.updatedAt || item.createdAt || item.date);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return timestamp >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function resolveRegenerationModelId(
  item: PlaygroundHistoryItem,
  groups: PlaygroundModelGroup[],
  selectedModels: Record<Modality, string>,
): string | undefined {
  const targetType = mapSdkworkGenerationHistoryTypeToModality(item.type);
  const bucket = targetType === undefined ? 'llms' : toModelBucket(targetType);
  if (!bucket) {
    return undefined;
  }
  const candidates = [
    item.modelCatalogKey,
    item.modelInfo,
    targetType === undefined ? selectedModels.agent || selectedModels.chat : selectedModels[targetType],
    readFirstModelId(groups, bucket),
  ].filter((value): value is string => Boolean(value));
  return candidates.find((candidate) => hasSelectedModel(groups, bucket, candidate)) || candidates[0];
}

function readRegenerationGenerationConfig(item: PlaygroundHistoryItem): PlaygroundGenerationConfig | undefined {
  return restoreSdkworkGenerationSerializedConfigFromHistoryItem(item);
}

function previewPromptLabelKey(kind: 'text' | 'image' | 'video' | 'audio' | null, item: PlaygroundHistoryItem | null): string {
  if (kind === 'text') {
    return 'playground.preview.agentPrompt';
  }
  if (kind === 'video') {
    return 'playground.preview.videoPrompt';
  }
  if (kind === 'image') {
    return 'playground.preview.imagePrompt';
  }
  if (item?.type === 'music') {
    return 'playground.preview.musicPrompt';
  }
  if (item?.type === 'sfx') {
    return 'playground.preview.sfxPrompt';
  }
  return 'playground.preview.audioPrompt';
}

function createPendingHistoryItemId(host: { createClientOperationToken(scope: string): string }): string {
  return host.createClientOperationToken('pending-agent-run');
}

function PlaygroundPageInner({ ChatPage }: { ChatPage: PlaygroundPageProps['ChatPage'] }) {
  const host = usePlaygroundHost();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [modality, setModality] = useState<Modality>(() => readPlaygroundModalityFromPath(location.pathname));
  const [selectedModality, setSelectedModality] = useState<GenerationModality>('image');
  const [previewItem, setPreviewItem] = useState<PlaygroundHistoryItem | null>(null);
  const [agentHistory, setAgentHistory] = useState<PlaygroundHistoryItem[]>([]);
  const [modelGroups, setModelGroups] = useState<PlaygroundModelGroup[]>([]);
  const [isAgentSubmitting, setIsAgentSubmitting] = useState(false);
  const [agentSubmitError, setAgentSubmitError] = useState<string | null>(null);
  const activeIndex = previewItem?.activeIndex || 0;

  const [selectedModels, setSelectedModels] = useState<Record<Modality, string>>({
    agent: '',
    chat: '',
    image: '',
    video: '',
    music: '',
    audio: '',
    sfx: '',
    package: '',
    assets: '',
  });
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [openFilter, setOpenFilter] = useState<'time' | 'type' | 'action' | null>(null);
  const [timeFilter, setTimeFilter] = useState(DEFAULT_FILTER);
  const [typeFilter, setTypeFilter] = useState(DEFAULT_FILTER);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const nextModality = readPlaygroundModalityFromPath(location.pathname);
    setModality(nextModality);
    if (nextModality === 'agent') {
      setSelectedModality('agent');
    }

    const canonicalPath = readCanonicalPlaygroundPath(location.pathname);
    if (canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    let cancelled = false;

    host.fetchGenerationHistory()
      .then((items) => {
        if (!cancelled) {
          setAgentHistory(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAgentHistory([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    host.fetchModelGroups()
      .then((groups) => {
        if (!cancelled) {
          setModelGroups(groups);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModelGroups([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (modelGroups.length === 0) {
      return;
    }

    setSelectedModels((current) => {
      let next = current;
      (['agent', 'image', 'video', 'music', 'audio', 'sfx'] as GenerationModality[]).forEach((targetModality) => {
        const bucket = toModelBucket(targetModality);
        if (!bucket || hasSelectedModel(modelGroups, bucket, current[targetModality])) {
          return;
        }
        const firstModelId = readFirstModelId(modelGroups, bucket);
        if (firstModelId) {
          if (next === current) {
            next = { ...current };
          }
          next[targetModality] = firstModelId;
        }
      });
      return next;
    });
  }, [modelGroups]);

  useEffect(() => {
    setShowModelMenu(false);
  }, [modality]);

  const filteredAgentHistory = useMemo(() => {
    let result = agentHistory;

    if (searchQuery.trim() !== '') {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      result = result.filter((item) => item.prompt.toLowerCase().includes(normalizedQuery));
    }

    if (typeFilter !== DEFAULT_FILTER) {
      result = result.filter((item) => {
        if (typeFilter === 'image') {
          return isImageItem(item);
        }
        return item.type === typeFilter;
      });
    }

    result = result.filter((item) => isWithinTimeFilter(item, timeFilter));

    return result;
  }, [agentHistory, searchQuery, timeFilter, typeFilter]);

  const updateSelectedModel = (targetModality: Modality) => (model: string) => {
    setSelectedModels((current) => ({ ...current, [targetModality]: model }));
  };

  const openAgentView = () => {
    navigate(PLAYGROUND_MODALITY_ROUTES.agent);
    setModality('agent');
    setSelectedModality('agent');
  };

  const openPlaygroundModality = (nextModality: PlaygroundAssetRouteModality) => {
    navigate(PLAYGROUND_MODALITY_ROUTES[nextModality]);
    setModality(nextModality);
  };

  const submitAgentGeneration = async ({
    prompt,
    selectedModality: inputModality,
    selectedModel,
    generationConfig,
    referenceImages,
    referenceAssets,
    referenceMode,
  }: PlaygroundGenerationSubmitInput) => {
    setAgentSubmitError(null);
    setIsAgentSubmitting(true);
    const targetType = inputModality === 'agent' ? undefined : inputModality;
    const modelId = selectedModel || selectedModels[inputModality] || selectedModels.agent || undefined;
    const pendingItem = createSdkworkGenerationPendingHistoryItem({
      id: createPendingHistoryItemId(host),
      prompt,
      selectedModel: modelId,
      targetType,
      generationConfig,
    }) as PlaygroundHistoryItem;
    setAgentHistory((current) => [pendingItem, ...current]);
    try {
      const result = await host.runGeneration({
        selectedModality: inputModality,
        prompt,
        targetType,
        selectedModel: modelId,
        generationConfig,
        referenceImages,
        referenceAssets,
        referenceMode,
        onDelta: (delta) => {
          if (!delta) {
            return;
          }
          setAgentHistory((current) => current.map((item) => (
            item.id === pendingItem.id
              ? {
                ...item,
                outputText: `${item.outputText || ''}${delta}`,
                status: 'processing',
                updatedAt: new Date().toISOString(),
              }
              : item
          )));
        },
        onArtifact: (artifact) => {
          setAgentHistory((current) => current.map((item) => (
            item.id === pendingItem.id
              ? appendSdkworkGenerationArtifactToHistoryItem(item, artifact)
              : item
          )));
        },
      });
      setAgentHistory((current) => [result.item, ...current.filter((item) => item.id !== result.item.id && item.id !== pendingItem.id)]);
    } catch (error) {
      setAgentHistory((current) => current.map((item) => (
        item.id === pendingItem.id
          ? {
            ...item,
            status: 'failed',
            updatedAt: new Date().toISOString(),
          }
          : item
      )));
      const message = error instanceof Error && error.message.startsWith('playground.')
        ? t(error.message)
        : error instanceof Error
          ? error.message
          : t('playground.agent.submitError');
      setAgentSubmitError(message);
      throw error;
    } finally {
      setIsAgentSubmitting(false);
    }
  };

  const renderFilterOptions = (
    options: readonly { id: string; labelKey: string }[],
    activeValue: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="flex flex-col space-y-0.5">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            onSelect(option.id);
            setOpenFilter(null);
          }}
          className="sdkwork-playground-filter-option flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors"
        >
          {t(option.labelKey)}
          {activeValue === option.id && <Check className="h-4 w-4 text-white" />}
        </button>
      ))}
    </div>
  );

  const previewKind = previewItem ? getSdkworkGenerationPreviewKind(previewItem.type) : null;
  const isText = previewItem?.type === 'text';
  const previewVideoUrl = previewKind === 'video' ? readSdkworkGenerationMediaUrl(previewItem?.videos?.[activeIndex] ?? previewItem?.asset) : undefined;
  const previewImageUrl = previewKind === 'image' ? readSdkworkGenerationMediaUrl(previewItem?.images?.[activeIndex] ?? previewItem?.asset) : undefined;
  const previewAudioUrl = previewKind === 'audio' ? readSdkworkGenerationMediaUrl(previewItem?.asset) : undefined;
  const previewText = previewKind === 'text' ? previewItem?.outputText : undefined;
  const previewThumbnails = previewKind === 'video' ? previewItem?.videos : previewKind === 'image' ? previewItem?.images : undefined;
  const previewAssetUrl = previewVideoUrl || previewImageUrl || previewAudioUrl || '';

  const downloadPreviewAsset = async () => {
    if (!previewAssetUrl) {
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = previewAssetUrl;
    anchor.download = `${previewItem?.id || 'playground-asset'}`;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const sharePreviewAsset = async () => {
    if (!previewAssetUrl) {
      return;
    }
    if (navigator.share) {
      await navigator.share({
        text: previewItem?.prompt || t('playground.preview.details'),
        url: previewAssetUrl,
      });
      return;
    }
    await host.copyTextToClipboard(previewAssetUrl);
  };

  const regeneratePreviewAsset = async () => {
    if (!previewItem?.prompt) {
      return;
    }
    await submitAgentGeneration({
      prompt: previewItem.prompt,
      selectedModality: mapSdkworkGenerationHistoryTypeToModality(previewItem.type) ?? 'agent',
      selectedModel: resolveRegenerationModelId(previewItem, modelGroups, selectedModels),
      generationConfig: readRegenerationGenerationConfig(previewItem),
    });
  };

  return (
    <div className="theme-aware-dark-surface sdkwork-playground-page flex h-full min-h-0 w-full flex-1 flex-row overflow-hidden">
      <div className="sdkwork-playground-rail h-full min-h-0">
        <IconSidebarItem active={modality === 'agent'} icon={Bot} label={t('playground.modality.agent')} onClick={openAgentView} isPrimary />
        <IconSidebarItem active={modality === 'chat'} icon={MessageSquare} label={t('playground.modality.chat')} onClick={() => { setModality('chat'); navigate(PLAYGROUND_MODALITY_ROUTES.chat); }} />
        <div className="sdkwork-playground-rail-divider" />
        <IconSidebarItem
          active={modality === 'image'}
          icon={PlaygroundImageOutlineIcon}
          activeIcon={PlaygroundImageFilledIcon}
          label={t('playground.modality.image')}
          onClick={() => openPlaygroundModality('image')}
        />
        <IconSidebarItem active={modality === 'video'} icon={Video} label={t('playground.modality.video')} onClick={() => openPlaygroundModality('video')} />
        <IconSidebarItem active={modality === 'music'} icon={Music} label={t('playground.modality.music')} onClick={() => openPlaygroundModality('music')} />
        <IconSidebarItem active={modality === 'audio'} icon={Headphones} label={t('playground.modality.audio')} onClick={() => openPlaygroundModality('audio')} />
        <IconSidebarItem active={modality === 'sfx'} icon={FileAudio} label={t('playground.modality.sfx')} onClick={() => openPlaygroundModality('sfx')} />
        <div className="sdkwork-playground-rail-divider" />
        <IconSidebarItem active={modality === 'assets'} icon={FolderOpen} label={t('playground.modality.assets')} onClick={() => openPlaygroundModality('assets')} />
      </div>

      <div className="sdkwork-playground-main relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {modality === 'agent' && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-14 shrink-0 items-center justify-end px-6">
            <div ref={filterRef} className="sdkwork-playground-filter-bar pointer-events-auto flex items-center p-1 px-2 transition-all">
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="sdkwork-playground-filter-search"
                data-active={isSearchOpen ? 'true' : 'false'}
              >
                <Search className="h-4 w-4" />
              </button>
              {isSearchOpen && (
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('playground.history.searchPlaceholder')}
                  className="sdkwork-playground-filter-input"
                />
              )}

              <div className="sdkwork-playground-filter-divider" />

              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'time' ? null : 'time')}
                  className="sdkwork-playground-filter-trigger flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors"
                  data-active={openFilter === 'time' ? 'true' : 'false'}
                >
                  {t('playground.filter.time')} <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === 'time' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'time' && (
                  <div className="sdkwork-playground-filter-menu absolute right-0 top-full z-50 mt-2 w-64 p-3">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="sdkwork-playground-filter-field flex flex-1 items-center rounded-md px-3 py-2">
                        <span className="sdkwork-playground-filter-field-label">{t('playground.filter.startDate')}</span>
                        <Calendar className="sdkwork-playground-filter-field-icon" />
                      </div>
                      <span className="sdkwork-playground-filter-field-separator">-</span>
                      <div className="sdkwork-playground-filter-field flex flex-1 items-center rounded-md px-3 py-2">
                        <span className="sdkwork-playground-filter-field-label">{t('playground.filter.endDate')}</span>
                        <Calendar className="sdkwork-playground-filter-field-icon" />
                      </div>
                    </div>
                    {renderFilterOptions(timeOptions, timeFilter, setTimeFilter)}
                  </div>
                )}
              </div>

              <div className="sdkwork-playground-filter-divider" />

              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
                  className="sdkwork-playground-filter-trigger flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors"
                  data-active={openFilter === 'type' ? 'true' : 'false'}
                >
                  {t('playground.filter.type')} <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === 'type' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'type' && (
                  <div className="sdkwork-playground-filter-menu absolute right-0 top-full z-50 mt-2 w-56 p-2 lg:left-0 lg:right-auto">
                    {renderFilterOptions(typeOptions, typeFilter, setTypeFilter)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {modality === 'agent' && (
            <div className="h-full min-h-0 flex-1 overflow-hidden">
              <AgentView
                agentHistory={filteredAgentHistory}
                setPreviewItem={setPreviewItem}
                selectedModality={selectedModality}
                setSelectedModality={setSelectedModality}
                modelGroups={modelGroups}
                selectedModels={selectedModels}
                setSelectedModel={updateSelectedModel}
                onSubmitGeneration={submitAgentGeneration}
                submitting={isAgentSubmitting}
                submitError={agentSubmitError}
              />
            </div>
          )}

          {modality === 'chat' && (
            <div className="h-full min-h-0 flex-1 overflow-hidden">
              <ChatPage />
            </div>
          )}

          {modality === 'assets' && (
            <div className="h-full min-h-0 flex-1 overflow-hidden">
              <AssetView
                agentHistory={filteredAgentHistory}
                setPreviewItem={setPreviewItem}
              />
            </div>
          )}

          {modality !== 'agent' && modality !== 'chat' && modality !== 'assets' && (
            <div className="h-full min-h-0 flex-1 overflow-hidden">
              {modality === 'image' && (
                <ImageView
                  agentHistory={filteredAgentHistory}
                  setPreviewItem={setPreviewItem}
                  modelGroups={modelGroups}
                  selectedModelId={selectedModels.image}
                  setSelectedModelId={updateSelectedModel('image')}
                  showModelMenu={showModelMenu}
                  setShowModelMenu={setShowModelMenu}
                  onSubmitGeneration={submitAgentGeneration}
                  submitting={isAgentSubmitting}
                  submitError={agentSubmitError}
                />
              )}
              {modality === 'video' && (
                <VideoView
                  agentHistory={filteredAgentHistory}
                  setPreviewItem={setPreviewItem}
                  modelGroups={modelGroups}
                  selectedModelId={selectedModels.video}
                  setSelectedModelId={updateSelectedModel('video')}
                  showModelMenu={showModelMenu}
                  setShowModelMenu={setShowModelMenu}
                  onSubmitGeneration={submitAgentGeneration}
                  submitting={isAgentSubmitting}
                  submitError={agentSubmitError}
                />
              )}
              {modality === 'music' && (
                <MusicView
                  agentHistory={filteredAgentHistory}
                  setPreviewItem={setPreviewItem}
                  modelGroups={modelGroups}
                  selectedModelId={selectedModels.music}
                  setSelectedModelId={updateSelectedModel('music')}
                  showModelMenu={showModelMenu}
                  setShowModelMenu={setShowModelMenu}
                  onSubmitGeneration={submitAgentGeneration}
                  submitting={isAgentSubmitting}
                  submitError={agentSubmitError}
                />
              )}
              {modality === 'audio' && (
                <AudioView
                  agentHistory={filteredAgentHistory}
                  setPreviewItem={setPreviewItem}
                  modelGroups={modelGroups}
                  selectedModelId={selectedModels.audio}
                  setSelectedModelId={updateSelectedModel('audio')}
                  showModelMenu={showModelMenu}
                  setShowModelMenu={setShowModelMenu}
                  onSubmitGeneration={submitAgentGeneration}
                  submitting={isAgentSubmitting}
                  submitError={agentSubmitError}
                />
              )}
              {modality === 'sfx' && (
                <SfxView
                  agentHistory={filteredAgentHistory}
                  setPreviewItem={setPreviewItem}
                  modelGroups={modelGroups}
                  selectedModelId={selectedModels.sfx}
                  setSelectedModelId={updateSelectedModel('sfx')}
                  showModelMenu={showModelMenu}
                  setShowModelMenu={setShowModelMenu}
                  onSubmitGeneration={submitAgentGeneration}
                  submitting={isAgentSubmitting}
                  submitError={agentSubmitError}
                />
              )}
            </div>
          )}
        </div>

        {previewItem && (
          <div className="sdkwork-playground-preview-overlay fixed inset-0 z-[100] flex">
            <div className="relative flex flex-1">
              <button
                onClick={() => setPreviewItem(null)}
                className="sdkwork-playground-preview-close pointer-events-auto absolute right-6 top-6 z-[60] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative flex min-h-0 flex-1 flex-row items-center justify-center gap-8 p-6">
                <div className="relative flex h-full min-h-0 min-w-0 flex-1 items-center justify-center">
                  <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl playground-image-preview-stage shadow-2xl">
                    {previewKind === 'video' && previewVideoUrl && (
                      <video src={previewVideoUrl} controls autoPlay loop className="h-full w-full rounded-2xl object-contain" />
                    )}
                    {previewKind === 'image' && previewImageUrl && (
                      <div className="flex h-full w-full items-center justify-center p-4">
                        <img src={previewImageUrl} alt="Preview" className="max-h-full max-w-full rounded-xl object-contain shadow-lg" style={{ border: '1px solid var(--theme-aware-image-frame)' }} />
                      </div>
                    )}
                    {isText && previewKind === 'text' && (
                      <div className="sdkwork-playground-preview-panel relative flex h-[600px] w-[800px] max-w-full flex-col overflow-hidden rounded-2xl">
                        <div className="sdkwork-playground-preview-text-header">
                          <Bot className="sdkwork-playground-preview-text-header__icon" />
                          {t('playground.preview.textOutput')}
                        </div>
                        <div className="sdkwork-playground-preview-text-body custom-scrollbar">
                          <ChatMarkdownMessage
                            content={previewText || t('playground.preview.noTextOutput')}
                            tone="assistant"
                            streaming={previewItem?.status === 'processing' || previewItem?.status === 'running'}
                          />
                        </div>
                      </div>
                    )}
                    {previewKind === 'audio' && (
                      <div className="sdkwork-playground-preview-audio-stage relative flex h-[600px] w-[800px] flex-col items-center justify-center overflow-hidden rounded-2xl">
                        <div className="sdkwork-playground-preview-audio-wave mb-10 flex h-32 items-end gap-1.5">
                          {[...Array(24)].map((_, index) => (
                            <div key={index} className="w-2.5 rounded-t-sm" style={getDeterministicWaveBarStyle(index, 20, 70)} />
                          ))}
                        </div>
                        <Activity className="sdkwork-playground-preview-audio-icon" />
                        <p className="text-sm font-medium tracking-wide">{t('playground.preview.audioWave')}</p>
                        {previewAudioUrl && <audio src={previewAudioUrl} controls autoPlay className="z-20 mt-8 w-[400px] rounded-full outline-none" />}
                      </div>
                    )}
                    {((previewKind === 'video' && !previewVideoUrl) || (previewKind === 'image' && !previewImageUrl)) && (
                      <div className="sdkwork-playground-preview-panel sdkwork-playground-preview-empty-hint">
                        {t('playground.preview.assetUnavailable')}
                      </div>
                    )}

                    {activeIndex > 0 && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewItem({ ...previewItem, activeIndex: activeIndex - 1 });
                        }}
                        className="sdkwork-playground-preview-nav absolute left-6 z-20 flex h-10 w-10 items-center justify-center rounded-[12px] opacity-0 transition-all group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}

                    {activeIndex < ((previewItem.videos?.length || previewItem.images?.length || 1) - 1) && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewItem({ ...previewItem, activeIndex: activeIndex + 1 });
                        }}
                        className="sdkwork-playground-preview-nav absolute right-6 z-20 flex h-10 w-10 items-center justify-center rounded-[12px] opacity-0 transition-all group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {previewThumbnails && previewThumbnails.length > 1 && (
                  <div className="hide-scrollbar z-10 flex h-full min-h-0 w-[80px] shrink-0 flex-col items-center gap-3 overflow-y-auto py-1">
                    {previewThumbnails.map((media, index) => {
                      const thumbSrc = readSdkworkGenerationMediaThumb(media);
                      if (!thumbSrc) {
                        return null;
                      }

                      return (
                        <button
                          key={`${thumbSrc}-${index}`}
                          type="button"
                          onClick={() => setPreviewItem({ ...previewItem, activeIndex: index })}
                          className="sdkwork-playground-preview-thumb playground-image-canvas group focus:outline-none"
                          data-active={activeIndex === index ? 'true' : 'false'}
                        >
                          <img src={thumbSrc} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="sdkwork-playground-preview-thumb__overlay" />
                          <div className="sdkwork-playground-preview-thumb__badge">
                            <span className="sdkwork-playground-preview-thumb__badge-label">v{index + 1}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="sdkwork-playground-preview-sidebar custom-scrollbar flex w-[380px] shrink-0 flex-col items-stretch overflow-y-auto border-l p-6 pt-20">
                <div className="mb-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      void downloadPreviewAsset();
                    }}
                    disabled={!previewAssetUrl}
                    data-enabled={previewAssetUrl ? 'true' : 'false'}
                    className="sdkwork-playground-preview-download flex items-center gap-2 px-4 py-2"
                  >
                    <Download className="h-4 w-4" /> {t('playground.preview.download')}
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void sharePreviewAsset();
                      }}
                      disabled={!previewAssetUrl}
                      data-enabled={previewAssetUrl ? 'true' : 'false'}
                      className="sdkwork-playground-preview-icon-btn flex h-9 w-9 items-center justify-center"
                      title={t('playground.preview.share')}
                      aria-label={t('playground.preview.share')}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void regeneratePreviewAsset();
                      }}
                      disabled={!previewItem.prompt}
                      data-enabled={previewItem.prompt ? 'true' : 'false'}
                      className="sdkwork-playground-preview-icon-btn flex h-9 w-9 items-center justify-center"
                      title={t('playground.preview.action.regenerate')}
                      aria-label={t('playground.preview.action.regenerate')}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-8 flex flex-col gap-3">
                  <h3 className="sdkwork-playground-preview-meta-label">
                    {t(previewPromptLabelKey(previewKind, previewItem))}
                  </h3>
                  <p className="sdkwork-playground-preview-meta-body">{previewItem.prompt || t('playground.preview.noPromptMetadata')}</p>
                  <div className="sdkwork-playground-preview-meta-details">
                    <span>{previewItem.modelInfo || t('common.status.pending')}</span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      {t('playground.preview.details')} <Clock className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="sdkwork-playground-preview-meta-footer">
                  <button
                    type="button"
                    onClick={() => {
                      void regeneratePreviewAsset();
                    }}
                    disabled={!previewItem.prompt || isAgentSubmitting}
                    data-enabled={previewItem.prompt && !isAgentSubmitting ? 'true' : 'false'}
                    className="sdkwork-playground-preview-action flex items-center justify-center rounded-xl py-2.5 text-xs font-medium"
                  >
                    {t('playground.preview.action.regenerate')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlaygroundPage({ host, ChatPage }: PlaygroundPageProps) {
  return (
    <PlaygroundHostProvider host={host}>
      <PlaygroundPageInner ChatPage={ChatPage} />
    </PlaygroundHostProvider>
  );
}

function isPlaygroundChatPath(pathname: string): boolean {
  return pathname === '/playground/chat'
    || pathname.startsWith('/playground/chat/')
    || pathname.startsWith('/c/');
}

function readPlaygroundModalityFromPath(pathname: string): PlaygroundRouteModality {
  if (isPlaygroundChatPath(pathname)) {
    return 'chat';
  }
  if (pathname === PLAYGROUND_MODALITY_ROUTES.agent) {
    return 'agent';
  }
  if (pathname === PLAYGROUND_MODALITY_ROUTES.video) {
    return 'video';
  }
  if (pathname === PLAYGROUND_MODALITY_ROUTES.music) {
    return 'music';
  }
  if (pathname === PLAYGROUND_MODALITY_ROUTES.audio) {
    return 'audio';
  }
  if (pathname === PLAYGROUND_MODALITY_ROUTES.sfx) {
    return 'sfx';
  }
  if (pathname === PLAYGROUND_MODALITY_ROUTES.assets) {
    return 'assets';
  }
  return 'image';
}

function readCanonicalPlaygroundPath(pathname: string): string | null {
  if (pathname === '/playground') {
    return PLAYGROUND_MODALITY_ROUTES.image;
  }
  if (pathname.startsWith('/playground/') && !isKnownPlaygroundRoute(pathname)) {
    return PLAYGROUND_MODALITY_ROUTES.image;
  }
  return null;
}

function isKnownPlaygroundRoute(pathname: string): boolean {
  if (isPlaygroundChatPath(pathname)) {
    return true;
  }
  return (Object.values(PLAYGROUND_MODALITY_ROUTES) as string[]).includes(pathname);
}
