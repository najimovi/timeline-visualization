import { twMerge } from 'tailwind-merge';
import { useTimeMarkers } from '@/hooks/useTimeMarkers';
import { formatMonthYear, formatDayMonth } from '@/lib/formatters';

export default function TimeMarkers() {
  const timeMarkers = useTimeMarkers();
  return (
    <div className="border-border bg-muted/30 absolute top-0 right-0 left-0 h-16 border-b">
      {/* Month markers */}
      {timeMarkers.months.map((marker, index) => (
        <div
          key={`month-${index}`}
          className="border-border absolute bottom-0 h-[5.5rem] border-l-8"
          style={{ left: `${marker.position}%` }}
        >
          <span className="text-foreground absolute top-1 left-2 text-sm font-bold">
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
              'text-muted-foreground absolute bottom-2 left-1 mb-2 rotate-45 text-[16px] font-semibold whitespace-nowrap select-none',
              // zoomLevel < 1 ? 'text-[10px]' : 'text-[14px]',
            )}
          >
            {formatDayMonth(marker.date)}
          </span>
        </div>
      ))}
    </div>
  );
}
