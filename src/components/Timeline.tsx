import {
  useTimelineLayout,
  type TimelineItem,
} from '@/hooks/useTimelineLayout';
import { useMaxLanes } from '@/hooks/useMaxLanes';
import { useTimeMarkers } from '@/hooks/useTimeMarkers';
import { useZoom } from '@/hooks/useZoom';
import { TIMELINE_COLORS } from '@/lib/constants';
import ZoomControls from '@/components/ZoomControls';
import EventLegend from '@/components/EventLegend';
import TimelineContainer from '@/components/TimelineContainer';

interface TimelineProps {
  items: TimelineItem[];
}

/**
 * Timeline orchestrator component
 *
 * Main orchestrator that coordinates all timeline functionality:
 * - Manages state through custom hooks (zoom, layout, markers)
 * - Composes child components for visualization
 * - Handles data flow between components
 *
 * @param items - Array of timeline events to display
 */
export default function Timeline({ items }: TimelineProps) {
  const {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    canZoomIn,
    canZoomOut,
    zoomPercentage,
  } = useZoom();
  const processedItems = useTimelineLayout({
    items,
    zoomLevel,
    colors: TIMELINE_COLORS,
  });
  const maxLanes = useMaxLanes(processedItems);
  const timeMarkers = useTimeMarkers({ processedItems, zoomLevel });

  if (!processedItems.length) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        No timeline items to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ZoomControls
        zoomPercentage={zoomPercentage}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />

      <TimelineContainer
        processedItems={processedItems}
        timeMarkers={timeMarkers}
        maxLanes={maxLanes}
        zoomLevel={zoomLevel}
      />

      <EventLegend
        processedItems={processedItems}
        maxLanes={maxLanes}
      />
    </div>
  );
}
