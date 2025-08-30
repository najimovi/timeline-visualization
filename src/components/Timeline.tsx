import { twMerge } from 'tailwind-merge';
import {
  useTimelineLayout,
  type TimelineItem,
} from '@/hooks/useTimelineLayout';
import { useMaxLanes } from '@/hooks/useMaxLanes';
import { useTimeMarkers } from '@/hooks/useTimeMarkers';
import { useZoom } from '@/hooks/useZoom';
import { TIMELINE_COLORS, TIMELINE_LAYOUT } from '@/lib/constants';
import TimelineEvent from '@/components/TimelineEvent';
import ZoomControls from '@/components/ZoomControls';

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  // ⭐ PERFORMANCE HOOK: Optimized zoom management with useCallback handlers
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

      <div className="bg-card relative overflow-x-auto rounded-lg border p-6">
        <div
          className="relative min-w-full"
          style={{
            width: `${100 * zoomLevel}%`,
            height: `${maxLanes * TIMELINE_LAYOUT.LANE_HEIGHT + TIMELINE_LAYOUT.HEADER_HEIGHT}px`,
          }}
        >
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0">
            {timeMarkers.days.map((marker, index) => (
              <div
                key={`grid-${index}`}
                className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
                style={{ left: `${marker.position}%` }}
              />
            ))}
          </div>

          <div
            className={`absolute top-0 right-0 left-0 h-${TIMELINE_LAYOUT.TIME_MARKER_HEIGHT} border-border bg-muted/30 border-b`}
          >
            {timeMarkers.months.map((marker, index) => (
              <div
                key={`month-${index}`}
                className="border-border absolute top-0 h-8 border-l-2"
                style={{ left: `${marker.position}%` }}
              >
                <span className="text-foreground absolute top-1 left-2 text-sm font-semibold">
                  {marker.date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}

            {timeMarkers.days.map((marker, index) => (
              <div
                key={`day-${index}`}
                className="absolute top-8 h-8"
                style={{ left: `${marker.position}%` }}
              >
                <span
                  className={twMerge(
                    'text-muted-foreground absolute top-1 left-1 origin-left whitespace-nowrap select-none',
                    'rotate-45',
                    zoomLevel < 1 ? 'text-[9px]' : 'text-[10px]',
                  )}
                >
                  {marker.date.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute top-16 right-0 bottom-0 left-0">
            {processedItems.map((item) => (
              <TimelineEvent
                key={item.id}
                item={item}
                zoomLevel={zoomLevel}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-muted-foreground space-y-2 text-sm">
        <p>
          <strong>{processedItems.length}</strong> events across{' '}
          <strong>{maxLanes}</strong> lanes • Hover for details • Use zoom
          controls to adjust view
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {processedItems.slice(0, 12).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2"
            >
              <div className={`h-3 w-3 rounded ${item.color}`}></div>
              <span className="truncate text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
