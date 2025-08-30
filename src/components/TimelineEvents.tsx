import { useTimelineLayout } from '@/hooks/useTimelineLayout';
import TimelineEvent from './TimelineEvent';

export default function TimelineEvents() {
  const processedItems = useTimelineLayout();
  
  return (
    <div className="absolute top-16 right-0 bottom-0 left-0">
      {processedItems.map((item) => (
        <TimelineEvent
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
