import {
  AssetGalleryView,
  mapGenerationHistoryToGalleryItems,
} from '@sdkwork/assets-pc-assets/gallery';
import type { PlaygroundHistoryItem, PlaygroundPreviewSetter } from '../../playground-types.ts';

interface AssetViewProps {
  agentHistory: PlaygroundHistoryItem[];
  setPreviewItem: PlaygroundPreviewSetter;
}

export function AssetView({
  agentHistory,
  setPreviewItem,
}: AssetViewProps) {
  const assets = mapGenerationHistoryToGalleryItems(agentHistory);

  const handlePreview = (asset: { id: string }) => {
    const originalItem = agentHistory.find((item) => item.id === asset.id);
    if (originalItem) {
      setPreviewItem(originalItem);
    }
  };

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden">
      <AssetGalleryView assets={assets} onPreview={handlePreview} />
    </div>
  );
}

export default AssetView;
