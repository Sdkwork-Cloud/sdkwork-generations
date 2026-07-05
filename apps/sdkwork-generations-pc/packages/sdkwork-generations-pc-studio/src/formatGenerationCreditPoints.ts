import { formatNumberLocale } from '@sdkwork/utils';

export function formatGenerationCreditPoints(value: number, locale = 'en-US'): string {
  return formatNumberLocale(value, locale, 0);
}
