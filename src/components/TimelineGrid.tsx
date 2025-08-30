import type { TimeMarkersResult } from '@/hooks/useTimeMarkers';

interface TimelineGridProps {
  timeMarkers: TimeMarkersResult;
}

export default function TimelineGrid({ timeMarkers }: TimelineGridProps) {
  return (
    <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0">
      {timeMarkers.days.map((marker, index) => (
        <div
          key={`grid-${index}`}
          className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
          style={{ left: `${marker.position}%` }}
        />
      ))}
    </div>
  );
}
