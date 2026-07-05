import { useEffect, useState } from 'react';
import {
  resolveGenerationWorkspaceKindFromModality,
  type GenerationWorkspaceKind,
} from './generationWorkspaceKind';

export interface UseGenerationWorkspaceKindOptions {
  agentModality?: string;
}

export function useGenerationWorkspaceKind(
  modality: string,
  options?: UseGenerationWorkspaceKindOptions,
) {
  const agentModality = options?.agentModality;
  const [activeKind, setActiveKind] = useState<GenerationWorkspaceKind>(() =>
    resolveGenerationWorkspaceKindFromModality(modality, agentModality),
  );

  useEffect(() => {
    setActiveKind(resolveGenerationWorkspaceKindFromModality(modality, agentModality));
  }, [modality, agentModality]);

  return { activeKind, setActiveKind };
}

/** @deprecated Use useGenerationWorkspaceKind */
export const useAssetWorkspaceKind = useGenerationWorkspaceKind;
export type UseAssetWorkspaceKindOptions = UseGenerationWorkspaceKindOptions;
