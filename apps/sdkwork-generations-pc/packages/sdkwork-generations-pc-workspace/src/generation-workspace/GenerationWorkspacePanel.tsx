import type { ReactNode } from 'react';
import { GenerationWorkspaceKindTabs, type GenerationWorkspaceKindTabsProps } from './GenerationWorkspaceKindTabs';
import type { GenerationWorkspaceKind, GenerationWorkspaceKindTab } from './generationWorkspaceKind';

export interface GenerationWorkspacePanelProps {
  tabs: readonly GenerationWorkspaceKindTab[];
  activeKind: GenerationWorkspaceKind;
  onActiveKindChange: (kind: GenerationWorkspaceKind) => void;
  resolveTabLabel?: GenerationWorkspaceKindTabsProps['resolveLabel'];
  isEmpty?: boolean;
  emptyContent?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  headerEnd?: ReactNode;
}

export function GenerationWorkspacePanel({
  tabs,
  activeKind,
  onActiveKindChange,
  resolveTabLabel,
  isEmpty = false,
  emptyContent,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  headerEnd,
}: GenerationWorkspacePanelProps) {
  return (
    <div
      className={`sdkwork-generation-workspace-panel flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden ${className}`.trim()}
    >
      <div
        className={`sdkwork-generation-workspace-panel__header shrink-0 px-6 pb-4 pt-5 sm:px-8 sm:pt-6 ${headerClassName}`.trim()}
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <GenerationWorkspaceKindTabs
            tabs={tabs}
            activeKind={activeKind}
            onActiveKindChange={onActiveKindChange}
            resolveLabel={resolveTabLabel}
            className="min-w-0 flex-1"
          />
          {headerEnd ? <div className="shrink-0">{headerEnd}</div> : null}
        </div>
      </div>

      <div className={`sdkwork-generation-workspace-panel__content custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-24 pt-4 sm:px-8 ${contentClassName}`.trim()}>
        {isEmpty ? (
          <div className="sdkwork-generation-workspace-panel__empty flex flex-1 items-center justify-center py-10">
            {emptyContent}
          </div>
        ) : (
          <div className="flex w-full flex-col gap-8 sm:gap-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/** @deprecated Use GenerationWorkspacePanel */
export const AssetWorkspacePanel = GenerationWorkspacePanel;
export type AssetWorkspacePanelProps = GenerationWorkspacePanelProps;
