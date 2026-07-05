import type { ComponentType, SVGProps } from 'react';
import type { LucideIcon } from 'lucide-react';

type RailIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export function IconSidebarItem({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  active,
  onClick,
}: {
  icon: RailIcon;
  activeIcon?: RailIcon;
  label: string;
  active: boolean;
  isPrimary?: boolean;
  onClick: () => void;
}) {
  const usesIconPair = Boolean(ActiveIcon);
  const RenderIcon = active && ActiveIcon ? ActiveIcon : Icon;

  return (
    <button
      onClick={onClick}
      type="button"
      data-active={active ? 'true' : 'false'}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className="sdkwork-playground-rail-item"
    >
      <span
        className="sdkwork-playground-rail-item__icon"
        data-icon-pair={usesIconPair ? 'true' : undefined}
      >
        <RenderIcon
          className={
            usesIconPair
              ? active
                ? 'sdkwork-playground-rail-item__svg sdkwork-playground-rail-item__svg--filled'
                : 'sdkwork-playground-rail-item__svg sdkwork-playground-rail-item__svg--outline'
              : 'sdkwork-playground-rail-item__svg'
          }
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
