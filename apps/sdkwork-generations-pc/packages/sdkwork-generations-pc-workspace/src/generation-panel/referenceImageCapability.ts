import type { AssetGenerationModelOption, AssetGenerationTargetType } from './types';
import {
  IMAGE_REFERENCE_MODE_ORDER,
  resolveImageReferenceCapability as resolveImageReferenceCapabilityForModel,
  resolveImageReferenceModeUpload as resolveImageReferenceModeUploadForModel,
  type ImageReferenceCapability,
  type ImageReferenceMode,
  type ImageReferenceModeUpload,
} from '@sdkwork/image-pc-generation';

export type { ImageReferenceMode, ImageReferenceModeUpload };
export type ReferenceImageCapability = ImageReferenceCapability;
export { IMAGE_REFERENCE_MODE_ORDER };

export function resolveImageReferenceCapability(
  modality: AssetGenerationTargetType,
  model: AssetGenerationModelOption | null | undefined,
): ReferenceImageCapability {
  if (modality !== 'image') {
    return {
      enabled: false,
      maxImages: 0,
      supportedModes: ['text_to_image'],
    };
  }
  return resolveImageReferenceCapabilityForModel(model);
}

/** @deprecated Use resolveImageReferenceCapability instead. */
export function resolveReferenceImageCapability(
  modality: AssetGenerationTargetType,
  model: AssetGenerationModelOption | null | undefined,
): ReferenceImageCapability {
  return resolveImageReferenceCapability(modality, model);
}

export function resolveImageReferenceModeUpload(
  capability: ReferenceImageCapability,
  mode: ImageReferenceMode,
): ImageReferenceModeUpload {
  return resolveImageReferenceModeUploadForModel(capability, mode);
}
