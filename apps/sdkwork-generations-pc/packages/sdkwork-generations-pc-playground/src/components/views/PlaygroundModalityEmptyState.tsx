import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PlaygroundModalityEmptyState({
  descriptionKey,
  icon: Icon,
  titleKey,
}: {
  descriptionKey: string;
  icon: LucideIcon;
  titleKey: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="sdkwork-studio-empty w-full max-w-xl px-6 py-16 text-center">
      <div className="sdkwork-studio-empty-icon mx-auto mb-5 flex h-14 w-14 items-center justify-center">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{t(titleKey)}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed">{t(descriptionKey)}</p>
    </div>
  );
}
