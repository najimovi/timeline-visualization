import type { ProcessedItem } from '@/hooks/useTimelineLayout';
import TimelineEvent from './TimelineEvent';

interface TimelineEventsProps {
  processedItems: ProcessedItem[];
  zoomLevel: number;
}

export default function TimelineEvents({
  processedItems,
  zoomLevel,
}: TimelineEventsProps) {
  return (
    <div className="absolute top-16 right-0 bottom-0 left-0">
      {processedItems.map((item) => (
        <TimelineEvent
          key={item.id}
          item={item}
          zoomLevel={zoomLevel}
        />
      ))}
    </div>
  );
}
