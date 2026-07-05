import { describe, expect, it } from 'vitest';
import {
  filterItemsByAssetWorkspaceKind,
  resolveAssetWorkspaceKindFromModality,
} from './assetWorkspaceKind';

describe('filterItemsByAssetWorkspaceKind', () => {
  const items = [
    { id: '1', type: 'image' },
    { id: '2', type: 'video' },
    { id: '3', type: 'music' },
    { id: '4', type: 'image_variant' },
  ];

  it('returns all items when kind is all', () => {
    expect(filterItemsByAssetWorkspaceKind(items, 'all', (item) => item.type)).toHaveLength(4);
  });

  it('filters by exact type match', () => {
    expect(filterItemsByAssetWorkspaceKind(items, 'video', (item) => item.type)).toEqual([
      { id: '2', type: 'video' },
    ]);
  });

  it('uses isImageType predicate for image kind', () => {
    const filtered = filterItemsByAssetWorkspaceKind(items, 'image', (item) => item.type, {
      isImageType: (type) => type === 'image' || type === 'image_variant',
    });
    expect(filtered.map((item) => item.id)).toEqual(['1', '4']);
  });
});

describe('resolveAssetWorkspaceKindFromModality', () => {
  it('maps agent modality to all', () => {
    expect(resolveAssetWorkspaceKindFromModality('agent')).toBe('all');
  });

  it('preserves concrete modality tabs', () => {
    expect(resolveAssetWorkspaceKindFromModality('video')).toBe('video');
  });
});
