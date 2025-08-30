import { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

interface ProcessedItem extends TimelineItem {
  startDate: Date;
  endDate: Date;
  lane: number;
  duration: number;
  position: number;
  width: number;
}

export default function Timeline({ items }: TimelineProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const processedItems = useMemo(() => {
    if (!items.length) return [];

    // Convert dates and sort by start date
    const itemsWithDates = items
      .map((item) => ({
        ...item,
        startDate: new Date(item.start),
        endDate: new Date(item.end),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Find timeline bounds
    const minDate = itemsWithDates[0].startDate;
    const maxDate = itemsWithDates.reduce(
      (max, item) => (item.endDate > max ? item.endDate : max),
      itemsWithDates[0].endDate,
    );

    const totalDuration = maxDate.getTime() - minDate.getTime();

    // Lane assignment with intelligent sharing
    const lanes: ProcessedItem[][] = [];
    const processed: ProcessedItem[] = [];

    for (const item of itemsWithDates) {
      const duration = item.endDate.getTime() - item.startDate.getTime();
      const position =
        (item.startDate.getTime() - minDate.getTime()) / totalDuration;
      const width = Math.max(duration / totalDuration, 0.01); // Minimum width for single-day events

      // Calculate if text will be readable (rough estimate)
      const estimatedTextWidth = item.name.length * 8; // ~8px per character
      const barPixelWidth = width * 800 * zoomLevel; // Assuming ~800px timeline width
      const textWillFit = barPixelWidth > estimatedTextWidth + 16; // 16px padding

      let assignedLane = -1;

      // Try to find a lane where this item fits
      for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
        const lane = lanes[laneIndex];
        let canFit = true;

        // Check for overlaps in this lane
        for (const existingItem of lane) {
          const existingEnd = existingItem.position + existingItem.width;
          const newEnd = position + width;

          // Check for overlap
          if (!(position >= existingEnd || newEnd <= existingItem.position)) {
            canFit = false;
            break;
          }
        }

        if (canFit) {
          // If text won't fit and there are other lanes available, prefer a new lane
          if (!textWillFit && laneIndex < 3 && lanes.length < 6) {
            continue;
          }
          assignedLane = laneIndex;
          break;
        }
      }

      // If no suitable lane found, create a new one
      if (assignedLane === -1) {
        assignedLane = lanes.length;
        lanes.push([]);
      }

      const processedItem: ProcessedItem = {
        ...item,
        lane: assignedLane,
        duration,
        position,
        width,
      };

      lanes[assignedLane].push(processedItem);
      processed.push(processedItem);
    }

    return processed;
  }, [items, zoomLevel]);

  const maxLanes = Math.max(...processedItems.map((item) => item.lane), 0) + 1;

  // Generate time markers
  const timeMarkers = useMemo(() => {
    if (!processedItems.length) return [];

    const minDate = new Date(
      Math.min(...processedItems.map((item) => item.startDate.getTime())),
    );
    const maxDate = new Date(
      Math.max(...processedItems.map((item) => item.endDate.getTime())),
    );

    const markers = [];
    const current = new Date(minDate);
    current.setDate(1); // Start of month

    while (current <= maxDate) {
      const position =
        (current.getTime() - minDate.getTime()) /
        (maxDate.getTime() - minDate.getTime());
      markers.push({
        date: new Date(current),
        position: position * 100,
      });
      current.setMonth(current.getMonth() + 1);
    }

    return markers;
  }, [processedItems]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 0.5));

  if (!processedItems.length) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        No timeline items to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-muted-foreground px-2 text-sm">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-card relative overflow-x-auto rounded-lg border p-6">
        <div
          className="relative min-w-full"
          style={{
            width: `${100 * zoomLevel}%`,
            height: `${maxLanes * 60 + 80}px`,
          }}
        >
          {/* Time markers */}
          <div className="border-border absolute top-0 right-0 left-0 h-8 border-b">
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="border-border/50 absolute top-0 h-full border-l"
                style={{ left: `${marker.position}%` }}
              >
                <span className="text-muted-foreground absolute -top-1 left-1 text-xs font-medium">
                  {marker.date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline items */}
          <div className="absolute top-8 right-0 bottom-0 left-0">
            {processedItems.map((item) => {
              const barWidth = Math.max(item.width * 100, 0.5);
              const estimatedTextWidth = item.name.length * 8;
              const barPixelWidth = (barWidth / 100) * 800 * zoomLevel;
              const showTextInside = barPixelWidth > estimatedTextWidth + 16;

              return (
                <div
                  key={item.id}
                  className="group absolute"
                  style={{
                    left: `${item.position * 100}%`,
                    top: `${item.lane * 60 + 10}px`,
                    width: `${barWidth}%`,
                    height: '40px',
                  }}
                >
                  {/* Event bar */}
                  <div className="bg-primary border-primary/20 relative h-full rounded-md border shadow-sm transition-all duration-200 hover:shadow-md">
                    {/* Text inside bar (if it fits) */}
                    {showTextInside && (
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-primary-foreground truncate text-sm font-medium">
                          {item.name}
                        </span>
                      </div>
                    )}

                    {/* Tooltip/external label */}
                    <div className="absolute -top-8 left-0 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="bg-popover border-border rounded-md border px-2 py-1 whitespace-nowrap shadow-md">
                        <div className="text-popover-foreground text-sm font-medium">
                          {item.name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {item.start} → {item.end}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* External label for short bars */}
                  {!showTextInside && (
                    <div className="absolute top-full left-0 mt-1">
                      <span className="text-muted-foreground text-xs font-medium">
                        {item.name}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="text-muted-foreground text-sm">
        <p>
          <strong>{processedItems.length}</strong> events across{' '}
          <strong>{maxLanes}</strong> lanes • Hover over events for details •
          Use zoom controls to adjust view
        </p>
      </div>
    </div>
  );
}
