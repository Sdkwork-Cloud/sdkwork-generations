import type { GenerationWorkspaceKind, GenerationWorkspaceKindTab } from './generationWorkspaceKind';



export interface GenerationWorkspaceKindTabsProps {

  tabs: readonly GenerationWorkspaceKindTab[];

  activeKind: GenerationWorkspaceKind;

  onActiveKindChange: (kind: GenerationWorkspaceKind) => void;

  resolveLabel?: (tab: GenerationWorkspaceKindTab) => string;

  className?: string;

  buttonClassName?: string;

}



function defaultResolveLabel(tab: GenerationWorkspaceKindTab): string {

  return tab.label ?? tab.labelKey ?? tab.id;

}



export function GenerationWorkspaceKindTabs({

  tabs,

  activeKind,

  onActiveKindChange,

  resolveLabel = defaultResolveLabel,

  className = '',

  buttonClassName = '',

}: GenerationWorkspaceKindTabsProps) {

  return (

    <div className={`sdkwork-generation-workspace-tabs ${className}`.trim()}>

      {tabs.map((tab) => {

        const active = tab.id === activeKind;

        return (

          <button

            key={tab.id}

            type="button"

            onClick={() => onActiveKindChange(tab.id)}

            className={`sdkwork-generation-workspace-tabs__tab ${

              active ? 'sdkwork-generation-workspace-tabs__tab--active' : ''

            } ${buttonClassName}`.trim()}

          >

            {resolveLabel(tab)}

          </button>

        );

      })}

    </div>

  );

}



/** @deprecated Use GenerationWorkspaceKindTabs */

export const AssetWorkspaceKindTabs = GenerationWorkspaceKindTabs;

export type AssetWorkspaceKindTabsProps = GenerationWorkspaceKindTabsProps;


