import { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

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
  color: string;
}

export default function Timeline({ items }: TimelineProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const colors = [
    'bg-blue-500 border-blue-600 text-white',
    'bg-emerald-500 border-emerald-600 text-white',
    'bg-purple-500 border-purple-600 text-white',
    'bg-orange-500 border-orange-600 text-white',
    'bg-rose-500 border-rose-600 text-white',
    'bg-cyan-500 border-cyan-600 text-white',
    'bg-amber-500 border-amber-600 text-white',
    'bg-indigo-500 border-indigo-600 text-white',
  ];

  const processedItems = useMemo(() => {
    if (!items.length) return [];

    const itemsWithDates = items
      .map((item, index) => ({
        ...item,
        startDate: new Date(item.start),
        endDate: new Date(item.end),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const minDate = itemsWithDates[0].startDate;
    const maxDate = itemsWithDates.reduce(
      (max, item) => (item.endDate > max ? item.endDate : max),
      itemsWithDates[0].endDate,
    );

    const totalDuration = maxDate.getTime() - minDate.getTime();

    const lanes: ProcessedItem[][] = [];
    const processed: ProcessedItem[] = [];

    for (const item of itemsWithDates) {
      const duration = Math.max(
        item.endDate.getTime() - item.startDate.getTime(),
        86400000,
      );
      const position =
        (item.startDate.getTime() - minDate.getTime()) / totalDuration;
      const width = Math.max(duration / totalDuration, 0.02);

      const estimatedTextWidth = item.name.length * 8;
      const barPixelWidth = width * 1200 * zoomLevel;
      const textWillFit = barPixelWidth > estimatedTextWidth + 32;

      let assignedLane = -1;

      for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
        const lane = lanes[laneIndex];
        let canFit = true;

        for (const existingItem of lane) {
          const existingEnd = existingItem.position + existingItem.width;
          const newEnd = position + width;
          const buffer = 0.003;

          if (
            !(
              position >= existingEnd + buffer ||
              newEnd + buffer <= existingItem.position
            )
          ) {
            canFit = false;
            break;
          }
        }

        if (canFit) {
          if (
            !textWillFit &&
            item.name.length > 20 &&
            laneIndex < 3 &&
            lanes.length < 10
          ) {
            continue;
          }
          assignedLane = laneIndex;
          break;
        }
      }

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

  const timeMarkers = useMemo(() => {
    if (!processedItems.length) return { months: [], days: [] };

    const minDate = new Date(
      Math.min(...processedItems.map((item) => item.startDate.getTime())),
    );
    const maxDate = new Date(
      Math.max(...processedItems.map((item) => item.endDate.getTime())),
    );
    const totalDuration = maxDate.getTime() - minDate.getTime();

    const monthMarkers = [];
    const monthCurrent = new Date(minDate);
    monthCurrent.setDate(1);
    monthCurrent.setHours(0, 0, 0, 0);

    while (monthCurrent <= maxDate) {
      const position =
        ((monthCurrent.getTime() - minDate.getTime()) / totalDuration) * 100;
      monthMarkers.push({
        date: new Date(monthCurrent),
        position,
      });
      monthCurrent.setMonth(monthCurrent.getMonth() + 1);
    }

    const dayMarkers = [];
    const dayCurrent = new Date(minDate);
    dayCurrent.setHours(0, 0, 0, 0);

    let dayStep = 1;
    if (zoomLevel < 0.7)
      dayStep = 14; // Show every 2 weeks when zoomed out
    else if (zoomLevel < 1)
      dayStep = 7; // Show weekly when moderately zoomed out
    else if (zoomLevel < 1.5)
      dayStep = 3; // Show every 3 days
    else dayStep = 1; // Show daily when zoomed in

    while (dayCurrent <= maxDate) {
      const position =
        ((dayCurrent.getTime() - minDate.getTime()) / totalDuration) * 100;
      dayMarkers.push({
        date: new Date(dayCurrent),
        position,
      });
      dayCurrent.setDate(dayCurrent.getDate() + dayStep);
    }

    return { months: monthMarkers, days: dayMarkers };
  }, [processedItems, zoomLevel]);

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

      <div className="bg-card relative overflow-x-auto rounded-lg border p-6">
        <div
          className="relative min-w-full"
          style={{
            width: `${100 * zoomLevel}%`,
            height: `${maxLanes * 80 + 250}px`,
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

          <div className="border-border bg-muted/30 absolute top-0 right-0 left-0 h-16 border-b">
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
            {processedItems.map((item) => {
              const barWidth = Math.max(item.width * 100, 2);
              const estimatedTextWidth = item.name.length * 8;
              const barPixelWidth = (barWidth / 100) * 1200 * zoomLevel;
              const showTextInside = barPixelWidth > estimatedTextWidth + 40;

              return (
                <div
                  key={item.id}
                  className="group absolute"
                  style={{
                    left: `${item.position * 100}%`,
                    top: `${item.lane * 80 + 15}px`,
                    width: `${barWidth}%`,
                    height: '50px',
                  }}
                >
                  <div
                    className={`relative h-full rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-lg ${item.color}`}
                  >
                    {showTextInside && (
                      <div className="absolute inset-0 flex items-center overflow-hidden px-3">
                        <span className="overflow-hidden text-sm leading-tight font-medium text-ellipsis whitespace-nowrap">
                          {item.name}
                        </span>
                      </div>
                    )}

                    <div className="pointer-events-none absolute -top-14 left-0 z-30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="bg-popover border-border rounded-lg border px-3 py-2 whitespace-nowrap shadow-lg">
                        <div className="text-popover-foreground text-sm font-semibold">
                          {item.name}
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {item.start} → {item.end}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showTextInside && (
                    <div
                      className="absolute z-20"
                      style={{
                        left: barWidth < 15 ? `${barWidth + 2}%` : '2px', // Position right of short bars, left of longer bars
                        top: barWidth < 15 ? '15px' : '55px', // Position beside short bars, below longer bars
                        maxWidth: '200px',
                      }}
                    >
                      <span className="text-foreground bg-background/95 rounded border px-2 py-1 text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur-sm">
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
