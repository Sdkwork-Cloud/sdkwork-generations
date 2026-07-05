import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Clock, Expand, Loader2, Play, PlaySquare } from 'lucide-react';
import {
  readSdkworkGenerationMediaThumb,
  readSdkworkGenerationMediaUrl,
  type SdkworkGenerationHistoryItem,
  type SdkworkGenerationMedia,
} from '@sdkwork/generations-pc-workspace/generation-history';
import { getDeterministicWaveBarStyle } from './waveform';

export type GenerationHistoryPreviewItem = SdkworkGenerationHistoryItem;

export type GenerationHistoryPreviewSetter = (item: GenerationHistoryPreviewItem) => void;

const getGridColsClass = (length: number) => {
  if (length === 1) return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  if (length === 2) return 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3';
  if (length === 3) return 'grid-cols-3';
  if (length === 4) return 'grid-cols-2 md:grid-cols-4';
  if (length === 5 || length === 6) return 'grid-cols-3 md:grid-cols-3 xl:grid-cols-4';
  return 'grid-cols-4 md:grid-cols-4 xl:grid-cols-5';
};

export function GenerationHistoryVideoItem({
  item,
  setPreviewItem,
}: {
  item: SdkworkGenerationHistoryItem;
  setPreviewItem: GenerationHistoryPreviewSetter;
}) {
  const { t } = useTranslation();
  const videos = item.videos || (item.asset?.kind === 'video' ? [item.asset] : []);
  const gridClass = getGridColsClass(videos.length);

  if (videos.length === 0) {
    return <GenerationHistoryAssetPlaceholder item={item} />;
  }

  return (
    <div className={`grid ${gridClass} w-full gap-3`}>
      {videos.map((video: SdkworkGenerationMedia, index) => {
        const thumbSrc = readSdkworkGenerationMediaThumb(video);
        return (
          <div
            key={index}
            className="playground-image-canvas sdkwork-generation-history-media sdkwork-generation-history-media--video group relative aspect-[16/9] overflow-hidden rounded-lg"
          >
            <img
              src={thumbSrc}
              alt={t('generationHistory_videoThumbnailAlt')}
              className="relative z-[1] mx-auto h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="sdkwork-generation-history-media__video-overlay absolute inset-0 flex cursor-pointer flex-col items-center justify-center transition-all"
              onClick={() => setPreviewItem({ ...item, type: 'video', activeIndex: index })}
            >
              <PlaySquare className="sdkwork-generation-history-media__play-icon h-10 w-10 transform opacity-0 drop-shadow-lg transition-all group-hover:scale-110 group-hover:opacity-100" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GenerationHistoryMusicItem({
  item,
  setPreviewItem,
}: {
  item: SdkworkGenerationHistoryItem;
  setPreviewItem: GenerationHistoryPreviewSetter;
}) {
  const assetSrc = readSdkworkGenerationMediaUrl(item.asset);
  if (!assetSrc) {
    return <GenerationHistoryAssetPlaceholder item={item} />;
  }

  return (
    <div
      className="sdkwork-generation-history-card sdkwork-generation-history-card--music relative flex h-24 w-full cursor-pointer items-center px-4 transition-opacity hover:opacity-90"
      onClick={() => setPreviewItem(item)}
    >
      <button
        type="button"
        className="sdkwork-generation-history-card__play flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
      >
        <Play className="ml-1 h-5 w-5 text-white" />
      </button>
      <div className="sdkwork-generation-history-card__wave ml-4 flex h-8 flex-1 items-center gap-1 opacity-60">
        {[...Array(30)].map((_, index) => (
          <div key={index} className="flex-1 rounded-full" style={getDeterministicWaveBarStyle(index, 20, 80)} />
        ))}
      </div>
    </div>
  );
}

export function GenerationHistoryImagesItem({
  item,
  setPreviewItem,
}: {
  item: SdkworkGenerationHistoryItem;
  setPreviewItem: GenerationHistoryPreviewSetter;
}) {
  const { t } = useTranslation();
  const images = item.images || [];
  const gridClass = getGridColsClass(images.length);
  const aspectClass = aspectRatioClass(item.aspectRatio);

  if (images.length === 0) {
    return <GenerationHistoryAssetPlaceholder item={item} />;
  }

  return (
    <div className={`grid ${gridClass} w-full gap-3`}>
      {images.map((image: SdkworkGenerationMedia, index) => {
        const imageSrc = readSdkworkGenerationMediaUrl(image);
        if (!imageSrc) {
          return null;
        }
        return (
          <div
            key={index}
            className={`${aspectClass} playground-image-canvas sdkwork-generation-history-media sdkwork-generation-history-media--image group relative cursor-pointer overflow-hidden`}
            onClick={() => setPreviewItem({ ...item, type: 'image', activeIndex: index })}
          >
            <img
              src={imageSrc}
              alt={t('generationHistory_imageAlt')}
              className="relative z-[1] h-full w-full object-cover"
            />
            <div className="sdkwork-generation-history-media__image-overlay absolute inset-0 z-[2] flex items-end justify-between p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/90">
                {item.aspectRatio || '1:1'}
              </span>
              <Expand className="h-4 w-4 text-white/90" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GenerationHistoryAudioItem({
  item,
  setPreviewItem,
}: {
  item: SdkworkGenerationHistoryItem;
  setPreviewItem: GenerationHistoryPreviewSetter;
}) {
  const assetSrc = readSdkworkGenerationMediaUrl(item.asset);
  if (!assetSrc) {
    return <GenerationHistoryAssetPlaceholder item={item} />;
  }

  return (
    <div
      className={`sdkwork-generation-history-card sdkwork-generation-history-card--audio relative flex w-full cursor-pointer items-center gap-4 p-4 transition-opacity hover:opacity-90 ${item.type === 'sfx' ? 'sdkwork-generation-history-card--sfx' : ''}`}
      onClick={() => setPreviewItem(item)}
    >
      <button
        type="button"
        className="sdkwork-generation-history-card__play sdkwork-generation-history-card__play-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
      >
        <Play className="ml-0.5 h-4 w-4 text-white" />
      </button>
      <div className="flex-1">
        <div className="sdkwork-generation-history-card__wave flex h-6 items-end gap-1">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="flex-1 rounded-t-sm" style={getDeterministicWaveBarStyle(index, 30, 70)} />
          ))}
        </div>
      </div>
      {item.durationSeconds !== undefined ? (
        <div className="sdkwork-generation-history-card__duration font-mono text-xs">{formatDuration(item.durationSeconds)}</div>
      ) : null}
    </div>
  );
}

function aspectRatioClass(value: SdkworkGenerationHistoryItem['aspectRatio']): string {
  switch (value) {
    case '1:1':
      return 'aspect-square';
    case '9:16':
      return 'aspect-[9/16]';
    case '2:3':
      return 'aspect-[2/3]';
    case '3:4':
      return 'aspect-[3/4]';
    case '4:3':
      return 'aspect-[4/3]';
    case '3:2':
      return 'aspect-[3/2]';
    case '21:9':
      return 'aspect-[21/9]';
    case '16:9':
    default:
      return 'aspect-[16/9]';
  }
}

function formatDuration(value: number): string {
  const seconds = Math.max(0, Math.round(value));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function GenerationHistoryAssetPlaceholder({ item }: { item: SdkworkGenerationHistoryItem }) {
  const { t } = useTranslation();
  const status = (item.status || '').toLowerCase();
  const isFailed = status === 'failed' || status === 'cancelled';
  const isProcessing = status === 'processing' || status === 'running';
  const isPending = status === 'pending' || status === 'queued';
  const label = isFailed
    ? t('generationHistory_failed')
    : isProcessing
      ? t('generationHistory_processing')
      : isPending
        ? t('generationHistory_pending')
        : t('generationHistory_empty');
  const Icon = isFailed ? AlertCircle : isProcessing ? Loader2 : Clock;

  return (
    <div className="sdkwork-generation-history-placeholder flex min-h-[112px] w-full items-center justify-center px-4 text-center text-sm">
      <div className="flex flex-col items-center gap-2">
        <Icon className={`h-5 w-5 ${isProcessing ? 'animate-spin text-cyan-300' : isFailed ? 'text-red-300' : 'sdkwork-generation-history-placeholder__icon'}`} />
        <span>{label}</span>
      </div>
    </div>
  );
}

export interface GenerationHistoryItemViewProps {
  item: SdkworkGenerationHistoryItem;
  setPreviewItem: GenerationHistoryPreviewSetter;
  isCompact?: boolean;
  resolveTypeLabel?: (item: SdkworkGenerationHistoryItem) => string;
  resolveTypeIcon?: (item: SdkworkGenerationHistoryItem) => ReactNode;
  renderOutputText?: (outputText: string, streaming: boolean) => ReactNode;
}

export function GenerationHistoryItemView({
  item,
  setPreviewItem,
  isCompact = false,
  resolveTypeLabel,
  resolveTypeIcon,
  renderOutputText,
}: GenerationHistoryItemViewProps) {
  const { t } = useTranslation();
  const typeLabel = resolveTypeLabel?.(item) ?? item.type;
  const typeIcon = resolveTypeIcon?.(item);
  const [modelName, modelConfig] = (item.modelInfo || '').split('|').map((value) => value.trim());
  const isText = item.type === 'text';
  const isImage = item.type === 'image' || item.type === 'images';
  const isVideo = item.type === 'video';

  return (
    <div className="sdkwork-generation-history-item group flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="sdkwork-generation-history-item__type flex shrink-0 items-center gap-1.5 text-[13px] font-bold">
            {typeIcon}
            {typeLabel}
          </div>
          <div className="sdkwork-generation-history-item__divider mx-1 h-3 w-px" />
          <div className="sdkwork-generation-history-item__chip truncate rounded px-2 py-0.5 text-[10px] font-medium tracking-wide">
            {modelName || t('generationHistory_defaultModel')}
          </div>
          <div className="sdkwork-generation-history-item__chip truncate rounded px-2 py-0.5 text-[10px] font-medium tracking-wide">
            {modelConfig || t('generationHistory_defaultConfig')}
          </div>
        </div>
      </div>

      <p
        className={`sdkwork-generation-history-item__prompt ${isCompact ? 'line-clamp-2' : 'line-clamp-3 hover:line-clamp-none'} mt-0.5 cursor-pointer text-[13px] leading-relaxed transition-all`}
      >
        {item.prompt}
      </p>

      {item.outputText ? (
        <div className="sdkwork-generation-history-item__output min-w-0 max-w-full rounded-lg px-3 py-2 text-[13px] leading-relaxed">
          {renderOutputText?.(item.outputText, item.status === 'processing' || item.status === 'running') ?? item.outputText}
        </div>
      ) : null}

      {!isText ? (
        <div className="mt-1">
          {isVideo ? <GenerationHistoryVideoItem item={item} setPreviewItem={setPreviewItem} /> : null}
          {item.type === 'music' ? <GenerationHistoryMusicItem item={item} setPreviewItem={setPreviewItem} /> : null}
          {isImage ? <GenerationHistoryImagesItem item={item} setPreviewItem={setPreviewItem} /> : null}
          {item.type === 'audio' || item.type === 'sfx' ? (
            <GenerationHistoryAudioItem item={item} setPreviewItem={setPreviewItem} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
