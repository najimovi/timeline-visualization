import type { ProcessedItem } from '@/hooks/useTimelineLayout';
import type { TimeMarkersResult } from '@/hooks/useTimeMarkers';
import { TIMELINE_LAYOUT } from '@/lib/constants';
import TimelineGrid from './TimelineGrid';
import TimeMarkers from './TimeMarkers';
import TimelineEvents from './TimelineEvents';

interface TimelineContainerProps {
  processedItems: ProcessedItem[];
  timeMarkers: TimeMarkersResult;
  maxLanes: number;
  zoomLevel: number;
}

export default function TimelineContainer({
  processedItems,
  timeMarkers,
  maxLanes,
  zoomLevel,
}: TimelineContainerProps) {
  return (
    <div className="bg-card relative overflow-x-auto rounded-lg border p-6">
      <div
        className="relative min-w-full"
        style={{
          width: `${100 * zoomLevel}%`,
          height: `${maxLanes * TIMELINE_LAYOUT.LANE_HEIGHT + TIMELINE_LAYOUT.HEADER_HEIGHT}px`,
        }}
      >
        <TimelineGrid timeMarkers={timeMarkers} />
        <TimeMarkers
          timeMarkers={timeMarkers}
          zoomLevel={zoomLevel}
        />
        <TimelineEvents
          processedItems={processedItems}
          zoomLevel={zoomLevel}
        />
      </div>
    </div>
  );
}
