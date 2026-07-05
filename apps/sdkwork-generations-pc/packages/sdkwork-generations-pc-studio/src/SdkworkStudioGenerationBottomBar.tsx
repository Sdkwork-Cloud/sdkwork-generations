import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatGenerationCreditPoints } from './formatGenerationCreditPoints';

export interface SdkworkStudioGenerationBottomBarProps {
  canSubmit: boolean;
  creditEstimate: {
    detail: string;
    points: number | null;
    reference?: boolean;
  };
  onSubmit: () => void | Promise<void>;
  submitting: boolean;
}

export function SdkworkStudioGenerationBottomBar({
  canSubmit,
  creditEstimate,
  onSubmit,
  submitting,
}: SdkworkStudioGenerationBottomBarProps) {
  const { i18n, t } = useTranslation();
  const estimateDetail = creditEstimate.detail.startsWith('playground.')
    ? t(creditEstimate.detail)
    : creditEstimate.detail;
  const costLabel = creditEstimate.points === null
    ? t('playground.generationCost.unavailable')
    : t('playground.generationCost.points', {
      points: formatGenerationCreditPoints(creditEstimate.points, i18n.language),
    });
  const outputLabel = t('playground.generationOutput.items', { count: 1 });

  return (
    <div className="z-30 shrink-0" title={estimateDetail}>
      <div className="sdkwork-studio-bottom-bar flex h-[64px] items-center gap-2 px-4 py-3">
        <div className="min-w-0 flex-1" />
        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
          {creditEstimate.reference ? (
            <span className="sdkwork-studio-cost shrink-0 whitespace-nowrap text-[10px] font-semibold">
              {t('playground.generationCost.reference')}
            </span>
          ) : null}
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={() => { void onSubmit(); }}
            className={`sdkwork-studio-generate-btn flex h-9 w-[214px] shrink-0 items-center justify-between gap-2 whitespace-nowrap px-3 text-sm font-bold transition-all ${
              canSubmit && !submitting
                ? 'sdkwork-studio-generate-btn--enabled'
                : 'sdkwork-studio-generate-btn--disabled'
            }`}
          >
            {submitting ? (
              <span className="flex w-full items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              <>
                <span className="shrink-0">{t('playground.generate')}</span>
                <span className="min-w-0 flex-1 truncate text-center text-xs font-semibold opacity-75">{outputLabel}</span>
                <span className="shrink-0 text-xs font-bold">{costLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
