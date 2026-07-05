import type { MediaResourceLike } from '@sdkwork/assets-pc-commons';
import type {
  SdkworkGenerationAssetModality,
  SdkworkGenerationPriceAvailability,
  SdkworkGenerationReferencePrice,
  SdkworkGenerationSerializedAssetConfig,
} from '@sdkwork/generations-pc-workspace/generation-asset-config';

export type AssetGenerationTargetType = SdkworkGenerationAssetModality;

export type AssetGenerationConfig = SdkworkGenerationSerializedAssetConfig;

export type AssetReferenceAssetKind = 'image' | 'audio' | 'video';

export type AssetReferenceAssetRole =
  | 'first_frame'
  | 'last_frame'
  | 'reference_image'
  | 'reference_audio'
  | 'reference_video';

export type AssetReferenceImageMode =
  | 'text_to_image'
  | 'image_to_image';

export type AssetReferenceVideoMode =
  | 'text_to_video'
  | 'first_frame'
  | 'first_last_frame'
  | 'omni_reference';

export type AssetReferenceAssetMode =
  | AssetReferenceImageMode
  | AssetReferenceVideoMode
  | 'multi_reference';

export interface AssetReferenceImageInput {
  name: string;
  mimeType?: string;
  resource: MediaResourceLike;
  sizeBytes?: number;
}

export interface AssetReferenceAssetInput {
  kind: AssetReferenceAssetKind;
  role: AssetReferenceAssetRole;
  name: string;
  mimeType?: string;
  resource: MediaResourceLike;
  sizeBytes?: number;
}

export interface AssetGenerationSubmitInput {
  prompt: string;
  selectedModality: AssetGenerationTargetType | 'agent';
  targetType?: AssetGenerationTargetType;
  selectedModel?: string;
  generationConfig?: AssetGenerationConfig;
  referenceAssets?: AssetReferenceAssetInput[];
  referenceImages?: AssetReferenceImageInput[];
  referenceMode?: AssetReferenceAssetMode;
  onDelta?: (delta: string) => void;
  onArtifact?: (artifact: unknown) => void;
}

export type GenerationSubmitInput = AssetGenerationSubmitInput;

export interface AssetGenerationModelOption {
  id: string;
  catalogKey: string;
  model: string;
  name: string;
  displayName: string;
  desc: string;
  description?: string;
  ver: string;
  versionLabel: string;
  vendorCode: string;
  vendorName: string;
  modalities: string[];
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  apiFormat?: string;
  contextTokens?: number;
  maxOutputTokens?: number;
  providerCodes: string[];
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsJsonSchema: boolean;
  officialReferencePrices: SdkworkGenerationReferencePrice[];
  priceAvailability: SdkworkGenerationPriceAvailability;
}

export interface AssetGenerationModelGroup {
  id: string;
  llms: AssetGenerationModelOption[];
  images: AssetGenerationModelOption[];
  videos: AssetGenerationModelOption[];
  audios: AssetGenerationModelOption[];
  music: AssetGenerationModelOption[];
  sfx: AssetGenerationModelOption[];
}
