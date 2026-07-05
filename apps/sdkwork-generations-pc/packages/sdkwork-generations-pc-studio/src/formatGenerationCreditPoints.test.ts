import { describe, expect, it } from 'vitest';
import { formatGenerationCreditPoints } from './formatGenerationCreditPoints';

describe('formatGenerationCreditPoints', () => {
  it('formats credit points with locale grouping via sdkwork-utils', () => {
    expect(formatGenerationCreditPoints(1200, 'en-US')).toBe('1,200');
    expect(formatGenerationCreditPoints(42, 'en-US')).toBe('42');
  });
});
