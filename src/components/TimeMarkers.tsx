import { twMerge } from 'tailwind-merge';
import type { TimeMarkersResult } from '@/hooks/useTimeMarkers';
import { formatMonthYear, formatDayMonth } from '@/lib/formatters';

interface TimeMarkersProps {
  timeMarkers: TimeMarkersResult;
  zoomLevel: number;
}

export default function TimeMarkers({
  timeMarkers,
  zoomLevel,
}: TimeMarkersProps) {
  return (
    <div className="border-border bg-muted/30 absolute top-0 right-0 left-0 h-16 border-b">
      {/* Month markers */}
      {timeMarkers.months.map((marker, index) => (
        <div
          key={`month-${index}`}
          className="border-border absolute top-0 h-8 border-l-2"
          style={{ left: `${marker.position}%` }}
        >
          <span className="text-foreground absolute top-1 left-2 text-sm font-semibold">
            {formatMonthYear(marker.date)}
          </span>
        </div>
      ))}

      {/* Day markers */}
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
            {formatDayMonth(marker.date)}
          </span>
        </div>
      ))}
    </div>
  );
}
