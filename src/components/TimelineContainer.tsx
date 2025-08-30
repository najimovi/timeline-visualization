import { useTimelineLayout } from '@/hooks/useTimelineLayout';
import { useMaxLanes } from '@/hooks/useMaxLanes';
import { useZoom } from '@/hooks/useZoom';
import { TIMELINE_LAYOUT } from '@/lib/constants';
import TimelineGrid from './TimelineGrid';
import TimeMarkers from './TimeMarkers';
import TimelineEvents from './TimelineEvents';

export default function TimelineContainer() {
  const { zoomLevel } = useZoom();
  const processedItems = useTimelineLayout();
  const maxLanes = useMaxLanes(processedItems);
  
  return (
    <div className="bg-card relative overflow-x-auto rounded-lg border p-6">
      <div
        className="relative min-w-full"
        style={{
          width: `${100 * zoomLevel}%`,
          height: `${maxLanes * TIMELINE_LAYOUT.LANE_HEIGHT + TIMELINE_LAYOUT.HEADER_HEIGHT}px`,
        }}
      >
        <TimelineGrid />
        <TimeMarkers />
        <TimelineEvents />
      </div>
    </div>
  );
}
