import type { ComponentType } from 'react';
import type {
  GenerationAgentRunCreateResult,
  PlaygroundGenerationSubmitInput,
  PlaygroundHistoryItem,
  PlaygroundModelGroup,
} from './playground-types.ts';

export interface PlaygroundClipboardResult {
  ok: boolean;
}

export interface PlaygroundHostPort {
  fetchGenerationHistory(): Promise<PlaygroundHistoryItem[]>;
  fetchModelGroups(): Promise<PlaygroundModelGroup[]>;
  runGeneration(input: PlaygroundGenerationSubmitInput): Promise<GenerationAgentRunCreateResult>;
  createClientOperationToken(scope: string): string;
  copyTextToClipboard(text: string): Promise<PlaygroundClipboardResult>;
}

export interface PlaygroundPageProps {
  host: PlaygroundHostPort;
  ChatPage: ComponentType;
}
