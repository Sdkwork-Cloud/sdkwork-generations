import type {
  SdkworkGenerationAssetModality,
  SdkworkGenerationModelBucket,
} from '../generation-asset-config';
import type { SdkworkGenerationHistoryItem } from '../generation-history';
import type { ModelsPickerGroup, ModelsPickerOption } from '@sdkwork/models-pc-picker';
import type { ReactNode } from 'react';
import type { GenerationSubmitInput } from '../generation-panel/types';
import type { GenerationWorkspaceKindTab } from '../generation-workspace/generationWorkspaceKind';
import type { GenerationHistoryPreviewSetter } from '../generation-history-ui/GenerationHistoryMessageItems';

export interface DomainGenerationWorkspaceViewProps {
  agentHistory: SdkworkGenerationHistoryItem[];
  setPreviewItem: GenerationHistoryPreviewSetter;
  modelGroups: ModelsPickerGroup[];
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  showModelMenu: boolean;
  setShowModelMenu: (value: boolean) => void;
  onSubmitGeneration: (input: GenerationSubmitInput) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
  modality: SdkworkGenerationAssetModality;
  bucket: SdkworkGenerationModelBucket;
  placeholderKey: string;
  fallbackModel?: ModelsPickerOption;
  generationPanel: ReactNode;
  historyTabs?: readonly GenerationWorkspaceKindTab[];
  resolveTabLabel?: (tab: GenerationWorkspaceKindTab) => string;
  resolveTypeLabel?: (item: SdkworkGenerationHistoryItem) => string;
  resolveTypeIcon?: (item: SdkworkGenerationHistoryItem) => ReactNode;
  renderOutputText?: (outputText: string, streaming: boolean) => ReactNode;
  emptyContent?: ReactNode;
}
