export type SdkworkGenerationAssetModality = "audio" | "image" | "music" | "sfx" | "video";
export type SdkworkGenerationAssetAspectRatio = "1:1" | "16:9" | "9:16";
export type SdkworkGenerationAssetQuality = "high" | "standard";

export interface SdkworkGenerationImageModeConfig {
  aspectRatio: "auto" | "1:1" | "16:9" | "21:9" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16";
  count: number;
  quality: "1k" | "2k";
}

export interface SdkworkGenerationVideoModeConfig {
  aspectRatio: SdkworkGenerationAssetAspectRatio;
  count: number;
  duration: number;
  resolution: "4k" | "720p" | "1080p";
  syncAudioVideo: boolean;
}

export interface SdkworkGenerationSpeechModeConfig {
  responseFormat?: "aac" | "flac" | "mp3" | "opus" | "pcm" | "wav";
  speed?: number;
  voice?: string;
}

export interface SdkworkGenerationSfxModeConfig {
  loop: boolean;
  promptInfluence: number;
  responseFormat?: "mp3" | "wav";
}

export interface SdkworkGenerationAssetConfig {
  aspectRatio: SdkworkGenerationAssetAspectRatio;
  durationSeconds: number;
  imageCount: number;
  imageMode?: SdkworkGenerationImageModeConfig;
  quality: SdkworkGenerationAssetQuality;
  sfxMode?: SdkworkGenerationSfxModeConfig;
  speechMode?: SdkworkGenerationSpeechModeConfig;
  videoMode?: SdkworkGenerationVideoModeConfig;
}

export interface SdkworkGenerationSerializedAssetConfig {
  aspectRatio?: SdkworkGenerationAssetAspectRatio;
  durationSeconds?: number;
  imageCount?: number;
  imageMode?: SdkworkGenerationImageModeConfig;
  loop?: boolean;
  promptInfluence?: number;
  quality?: SdkworkGenerationAssetQuality;
  responseFormat?: SdkworkGenerationSpeechModeConfig["responseFormat"] | SdkworkGenerationSfxModeConfig["responseFormat"];
  resolution?: SdkworkGenerationVideoModeConfig["resolution"];
  sfxMode?: SdkworkGenerationSfxModeConfig;
  speechMode?: SdkworkGenerationSpeechModeConfig;
  speed?: number;
  syncAudioVideo?: boolean;
  videoMode?: SdkworkGenerationVideoModeConfig;
  voice?: string;
}

export type SdkworkGenerationModelBucket = "llms" | "images" | "videos" | "audios" | "music" | "sfx";

export interface SdkworkGenerationReferencePrice {
  billingMeter?: string;
  currency: string;
  unitPrice: string;
  usageMeter?: string;
}

export interface SdkworkGenerationPriceAvailability {
  status: "reference" | "unavailable";
  reason?: string | null;
}

export interface SdkworkGenerationPricedModel {
  officialReferenceCurrency?: string | null;
  officialReferencePrices: readonly SdkworkGenerationReferencePrice[];
  officialReferenceUnitPrice?: string | null;
  priceAvailability: SdkworkGenerationPriceAvailability;
}

export type SdkworkGenerationModelBuckets<TModel> = {
  [Bucket in SdkworkGenerationModelBucket]: readonly TModel[];
};

export interface SdkworkGenerationCreditEstimate {
  detail: string;
  points: number | null;
  reference: boolean;
}

export interface EstimateSdkworkGenerationCreditsInput<TModel extends SdkworkGenerationPricedModel> {
  config: SdkworkGenerationAssetConfig;
  modality: SdkworkGenerationAssetModality;
  model: TModel | null | undefined;
  pointsPerUsd?: number;
  unavailableDetail?: string;
}

const DEFAULT_SDKWORK_GENERATION_POINTS_PER_USD = 10;
const DEFAULT_SDKWORK_GENERATION_COST_UNAVAILABLE_DETAIL = "sdkwork.generation.cost.unavailable";

export const DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG: SdkworkGenerationImageModeConfig = {
  aspectRatio: "auto",
  count: 2,
  quality: "1k",
};

export const DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG: SdkworkGenerationVideoModeConfig = {
  aspectRatio: "16:9",
  count: 1,
  duration: 5,
  resolution: "1080p",
  syncAudioVideo: true,
};

export const DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG: SdkworkGenerationSpeechModeConfig = {
  responseFormat: "mp3",
  speed: 1,
  voice: "alloy",
};

export const DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG: SdkworkGenerationSfxModeConfig = {
  loop: false,
  promptInfluence: 0.5,
  responseFormat: "mp3",
};

export function getDefaultSdkworkGenerationDurationSeconds(
  modality: SdkworkGenerationAssetModality,
): number {
  switch (modality) {
    case "audio":
    case "sfx":
      return 8;
    case "music":
      return 30;
    case "video":
      return DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.duration;
    case "image":
      return 1;
  }
}

export function createDefaultSdkworkGenerationAssetConfig(
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationAssetConfig {
  const imageMode = { ...DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG };
  const videoMode = { ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG };
  const speechMode = { ...DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG };
  const sfxMode = { ...DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG };
  const config: SdkworkGenerationAssetConfig = {
    aspectRatio: modality === "image" ? normalizeImageAspectRatio(imageMode.aspectRatio, "1:1") : videoMode.aspectRatio,
    durationSeconds: getDefaultSdkworkGenerationDurationSeconds(modality),
    imageCount: modality === "image" ? imageMode.count : videoMode.count,
    quality: imageMode.quality === "2k" ? "high" : "standard",
  };

  if (modality === "image") {
    config.imageMode = imageMode;
  }
  if (modality === "video") {
    config.videoMode = videoMode;
    config.durationSeconds = videoMode.duration;
  }
  if (modality === "audio") {
    config.speechMode = speechMode;
  }
  if (modality === "sfx") {
    config.sfxMode = sfxMode;
  }
  return config;
}

export function reconcileSdkworkGenerationAssetConfig(
  config: SdkworkGenerationAssetConfig,
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationAssetConfig {
  const defaultConfig = createDefaultSdkworkGenerationAssetConfig(modality);
  const next: SdkworkGenerationAssetConfig = {
    ...defaultConfig,
    ...config,
    durationSeconds: config.durationSeconds || defaultConfig.durationSeconds,
  };

  if (modality === "image") {
    const imageMode = next.imageMode ?? { ...DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG };
    return {
      ...next,
      aspectRatio: normalizeImageAspectRatio(imageMode.aspectRatio, next.aspectRatio),
      imageCount: imageMode.count,
      imageMode,
      quality: imageMode.quality === "2k" ? "high" : "standard",
    };
  }

  if (modality === "video") {
    const videoMode = next.videoMode ?? { ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG };
    return {
      ...next,
      aspectRatio: videoMode.aspectRatio,
      durationSeconds: videoMode.duration,
      imageCount: videoMode.count,
      videoMode,
    };
  }

  if (modality === "audio") {
    return {
      ...next,
      speechMode: next.speechMode ?? { ...DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG },
    };
  }

  if (modality === "sfx") {
    return {
      ...next,
      sfxMode: next.sfxMode ?? { ...DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG },
    };
  }

  return next;
}

export function serializeSdkworkGenerationAssetConfig(
  config: SdkworkGenerationAssetConfig,
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationSerializedAssetConfig {
  const reconciled = reconcileSdkworkGenerationAssetConfig(config, modality);
  const result: SdkworkGenerationSerializedAssetConfig = {
    aspectRatio: reconciled.aspectRatio,
    durationSeconds: reconciled.durationSeconds,
    imageCount: reconciled.imageCount,
    quality: reconciled.quality,
  };

  if (reconciled.imageMode) {
    result.imageMode = reconciled.imageMode;
  }
  if (reconciled.videoMode) {
    result.videoMode = reconciled.videoMode;
    result.resolution = reconciled.videoMode.resolution;
    result.syncAudioVideo = reconciled.videoMode.syncAudioVideo;
  }
  if (reconciled.speechMode) {
    result.speechMode = reconciled.speechMode;
    result.voice = reconciled.speechMode.voice;
    result.responseFormat = reconciled.speechMode.responseFormat;
    result.speed = reconciled.speechMode.speed;
  }
  if (reconciled.sfxMode) {
    result.sfxMode = reconciled.sfxMode;
    result.promptInfluence = reconciled.sfxMode.promptInfluence;
    result.loop = reconciled.sfxMode.loop;
    result.responseFormat = reconciled.sfxMode.responseFormat;
  }
  return result;
}

export function createSdkworkGenerationAssetConfigFromSerialized(
  serialized: SdkworkGenerationSerializedAssetConfig | undefined,
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationAssetConfig {
  const defaultConfig = createDefaultSdkworkGenerationAssetConfig(modality);
  if (!serialized) {
    return defaultConfig;
  }

  const imageMode = serialized.imageMode
    ? { ...serialized.imageMode }
    : {
      ...DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG,
      aspectRatio: serialized.aspectRatio ?? DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG.aspectRatio,
      count: serialized.imageCount ?? DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG.count,
      quality: serialized.quality === "high" ? "2k" : DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG.quality,
    };
  const videoMode = serialized.videoMode
    ? { ...serialized.videoMode }
    : {
      ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG,
      aspectRatio: serialized.aspectRatio ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.aspectRatio,
      count: serialized.imageCount ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.count,
      duration: serialized.durationSeconds ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.duration,
      resolution: serialized.resolution ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.resolution,
      syncAudioVideo: serialized.syncAudioVideo ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.syncAudioVideo,
    };
  const speechMode = serialized.speechMode
    ? { ...serialized.speechMode }
    : {
      ...DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG,
      responseFormat: serialized.responseFormat as SdkworkGenerationSpeechModeConfig["responseFormat"] | undefined,
      speed: serialized.speed ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG.speed,
      voice: serialized.voice ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG.voice,
    };
  const sfxMode = serialized.sfxMode
    ? { ...serialized.sfxMode }
    : {
      ...DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG,
      loop: serialized.loop ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.loop,
      promptInfluence: serialized.promptInfluence ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.promptInfluence,
      responseFormat: serialized.responseFormat as SdkworkGenerationSfxModeConfig["responseFormat"] | undefined,
    };

  return reconcileSdkworkGenerationAssetConfig({
    ...defaultConfig,
    aspectRatio: serialized.aspectRatio ?? defaultConfig.aspectRatio,
    durationSeconds: serialized.durationSeconds ?? defaultConfig.durationSeconds,
    imageCount: serialized.imageCount ?? defaultConfig.imageCount,
    imageMode: modality === "image" ? imageMode : undefined,
    quality: serialized.quality ?? defaultConfig.quality,
    sfxMode: modality === "sfx" ? sfxMode : undefined,
    speechMode: modality === "audio" ? speechMode : undefined,
    videoMode: modality === "video" ? videoMode : undefined,
  }, modality);
}

export function updateSdkworkGenerationImageModeConfig(
  config: SdkworkGenerationAssetConfig,
  imageMode: SdkworkGenerationImageModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    imageMode,
  }, "image");
}

export function updateSdkworkGenerationVideoModeConfig(
  config: SdkworkGenerationAssetConfig,
  videoMode: SdkworkGenerationVideoModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    videoMode,
  }, "video");
}

export function updateSdkworkGenerationSpeechModeConfig(
  config: SdkworkGenerationAssetConfig,
  speechMode: SdkworkGenerationSpeechModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    speechMode,
  }, "audio");
}

export function updateSdkworkGenerationSfxModeConfig(
  config: SdkworkGenerationAssetConfig,
  sfxMode: SdkworkGenerationSfxModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    sfxMode,
  }, "sfx");
}

export function getSdkworkGenerationModelBucket(
  modality: SdkworkGenerationAssetModality,
): Exclude<SdkworkGenerationModelBucket, "llms"> {
  switch (modality) {
    case "audio":
      return "audios";
    case "image":
      return "images";
    case "music":
      return "music";
    case "sfx":
      return "sfx";
    case "video":
      return "videos";
  }
}

export function findSdkworkGenerationModelById<TModel extends { id: string }>(
  groups: readonly SdkworkGenerationModelBuckets<TModel>[],
  modelId: string,
): TModel | null {
  for (const group of groups) {
    for (const bucket of ["llms", "images", "videos", "audios", "music", "sfx"] as const) {
      const model = group[bucket].find((item) => item.id === modelId);
      if (model) {
        return model;
      }
    }
  }
  return null;
}

export function findFirstSdkworkGenerationModelForModality<TModel>(
  groups: readonly SdkworkGenerationModelBuckets<TModel>[],
  modality: SdkworkGenerationAssetModality,
): TModel | null {
  const bucket = getSdkworkGenerationModelBucket(modality);
  for (const group of groups) {
    const model = group[bucket][0];
    if (model) {
      return model;
    }
  }
  return null;
}

export function getSdkworkGenerationDurationOptions(
  modality: SdkworkGenerationAssetModality,
): number[] {
  switch (modality) {
    case "video":
      return [5, 10];
    case "music":
      return [15, 30, 60];
    case "audio":
    case "sfx":
      return [4, 8, 15];
    case "image":
      return [];
  }
}

export function estimateSdkworkGenerationCredits<TModel extends SdkworkGenerationPricedModel>({
  config,
  modality,
  model,
  pointsPerUsd = DEFAULT_SDKWORK_GENERATION_POINTS_PER_USD,
  unavailableDetail = DEFAULT_SDKWORK_GENERATION_COST_UNAVAILABLE_DETAIL,
}: EstimateSdkworkGenerationCreditsInput<TModel>): SdkworkGenerationCreditEstimate {
  if (!model || model.priceAvailability.status === "unavailable") {
    return createUnavailableSdkworkGenerationCreditEstimate(unavailableDetail);
  }

  const price = selectSdkworkGenerationReferencePrice(model.officialReferencePrices, modality)
    ?? createFallbackSdkworkGenerationReferencePrice(model);
  if (!price) {
    return createUnavailableSdkworkGenerationCreditEstimate(unavailableDetail);
  }

  const unitPrice = readPositiveSdkworkGenerationNumber(price.unitPrice);
  if (unitPrice === null) {
    return createUnavailableSdkworkGenerationCreditEstimate(unavailableDetail);
  }

  const quantity = estimateSdkworkGenerationMeterQuantity(readSdkworkGenerationPriceMeter(price), config);
  const points = Math.ceil(unitPrice * quantity * pointsPerUsd);
  return {
    detail: describeSdkworkGenerationCreditEstimate(price, quantity),
    points,
    reference: model.priceAvailability.status === "reference",
  };
}

function normalizeImageAspectRatio(
  aspectRatio: SdkworkGenerationImageModeConfig["aspectRatio"],
  fallback: SdkworkGenerationAssetAspectRatio,
): SdkworkGenerationAssetAspectRatio {
  if (aspectRatio === "1:1" || aspectRatio === "16:9" || aspectRatio === "9:16") {
    return aspectRatio;
  }
  return fallback;
}

function createUnavailableSdkworkGenerationCreditEstimate(detail: string): SdkworkGenerationCreditEstimate {
  return {
    detail,
    points: null,
    reference: false,
  };
}

function selectSdkworkGenerationReferencePrice(
  prices: readonly SdkworkGenerationReferencePrice[],
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationReferencePrice | null {
  const meters = getSdkworkGenerationMetersForModality(modality);
  for (const meter of meters) {
    const price = prices.find((candidate) => readSdkworkGenerationPriceMeter(candidate) === meter);
    if (price) {
      return price;
    }
  }
  return prices[0] ?? null;
}

function createFallbackSdkworkGenerationReferencePrice(
  model: SdkworkGenerationPricedModel,
): SdkworkGenerationReferencePrice | null {
  if (!model.officialReferenceUnitPrice || readPositiveSdkworkGenerationNumber(model.officialReferenceUnitPrice) === null) {
    return null;
  }
  return {
    currency: model.officialReferenceCurrency || "USD",
    unitPrice: model.officialReferenceUnitPrice,
    usageMeter: "api_result",
  };
}

function getSdkworkGenerationMetersForModality(
  modality: SdkworkGenerationAssetModality,
): string[] {
  switch (modality) {
    case "audio":
      return ["audio_second", "audio_minute", "speech_second", "api_result"];
    case "image":
      return ["image_result", "image_megapixel", "image_pixel", "image_output_token", "api_result"];
    case "music":
      return ["music_second", "music_minute", "audio_second", "api_result"];
    case "sfx":
      return ["sfx_second", "audio_second", "api_result"];
    case "video":
      return ["video_second", "video_result", "video_frame", "api_result"];
  }
}

function estimateSdkworkGenerationMeterQuantity(
  usageMeter: string,
  config: SdkworkGenerationAssetConfig,
): number {
  const qualityMultiplier = config.quality === "high" ? 1.5 : 1;
  if (usageMeter === "image_result") {
    return config.imageCount * qualityMultiplier;
  }
  if (usageMeter === "image_megapixel") {
    return config.imageCount * estimateSdkworkGenerationImagePixels(config.aspectRatio) / 1_000_000 * qualityMultiplier;
  }
  if (usageMeter === "image_pixel") {
    return config.imageCount * estimateSdkworkGenerationImagePixels(config.aspectRatio) * qualityMultiplier;
  }
  if (usageMeter.endsWith("_minute")) {
    return Math.max(1, config.durationSeconds / 60);
  }
  if (usageMeter.endsWith("_second")) {
    return Math.max(1, config.durationSeconds);
  }
  if (usageMeter === "video_result") {
    return Math.max(1, config.imageCount);
  }
  return 1;
}

function estimateSdkworkGenerationImagePixels(
  aspectRatio: SdkworkGenerationAssetAspectRatio,
): number {
  switch (aspectRatio) {
    case "16:9":
    case "9:16":
      return 1792 * 1024;
    case "1:1":
    default:
      return 1024 * 1024;
  }
}

function describeSdkworkGenerationCreditEstimate(
  price: SdkworkGenerationReferencePrice,
  quantity: number,
): string {
  return `${price.currency} ${formatSdkworkGenerationDecimal(price.unitPrice)} x ${formatSdkworkGenerationDecimal(quantity.toString())} ${getSdkworkGenerationUnitLabelForMeter(readSdkworkGenerationPriceMeter(price))}`;
}

function getSdkworkGenerationUnitLabelForMeter(usageMeter: string): string {
  if (usageMeter.includes("megapixel")) {
    return "MP";
  }
  if (usageMeter.includes("pixel")) {
    return "px";
  }
  if (usageMeter.endsWith("_second")) {
    return "sec";
  }
  if (usageMeter.endsWith("_minute")) {
    return "min";
  }
  if (usageMeter.endsWith("_result")) {
    return usageMeter.replace(/_result$/u, "");
  }
  return "unit";
}

function readSdkworkGenerationPriceMeter(price: SdkworkGenerationReferencePrice): string {
  return price.usageMeter ?? price.billingMeter ?? "api_result";
}

function readPositiveSdkworkGenerationNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return null;
  }
  return number;
}

function formatSdkworkGenerationDecimal(value: string): string {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return value;
  }
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}
