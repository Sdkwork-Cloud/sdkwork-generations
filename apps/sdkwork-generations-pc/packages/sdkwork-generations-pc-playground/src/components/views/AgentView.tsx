import { GenerationChatInput } from '../GenerationChatInput';
import { SharedHistoryView } from './SharedHistoryView';
import type { GenerationModality } from '../../playground-modality.ts';
import type {
  PlaygroundGenerationSubmitInput,
  PlaygroundHistoryItem,
  PlaygroundModelGroup,
  PlaygroundPreviewSetter,
} from '../../playground-types.ts';

export function AgentView({
  agentHistory,
  setPreviewItem,
  selectedModality,
  setSelectedModality,
  modelGroups,
  selectedModels,
  setSelectedModel,
  onSubmitGeneration,
  submitting,
  submitError,
}: {
  agentHistory: PlaygroundHistoryItem[];
  setPreviewItem: PlaygroundPreviewSetter;
  selectedModality: GenerationModality;
  setSelectedModality: (modality: GenerationModality) => void;
  modelGroups: PlaygroundModelGroup[];
  selectedModels: Record<GenerationModality, string>;
  setSelectedModel: (targetModality: GenerationModality) => (modelId: string) => void;
  onSubmitGeneration: (input: PlaygroundGenerationSubmitInput) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}) {
  return (
    <div className="sdkwork-generation-workspace-view relative z-10 flex h-full min-h-0 w-full flex-row overflow-hidden">
      <div className="sdkwork-playground-workspace-sidebar sdkwork-playground-workspace-sidebar--agent relative z-20 flex h-full min-h-0 flex-col overflow-hidden border-r">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-6">
          <GenerationChatInput
            selectedModality={selectedModality === 'agent' ? 'agent' : 'image'}
            setSelectedModality={setSelectedModality}
            modelGroups={modelGroups}
            selectedModels={selectedModels}
            setSelectedModel={setSelectedModel}
            onSubmit={onSubmitGeneration}
            submitting={submitting}
          />
          {submitError ? (
            <div className="sdkwork-playground-agent-error">{submitError}</div>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <SharedHistoryView agentHistory={agentHistory} setPreviewItem={setPreviewItem} modality="agent" />
      </div>
    </div>
  );
}
