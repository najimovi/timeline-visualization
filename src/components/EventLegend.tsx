import { useTimelineLayout } from '@/hooks/useTimelineLayout';

export default function EventLegend() {
  const processedItems = useTimelineLayout();
  return (
    <div className="text-muted-foreground space-y-2 text-sm">
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
  );
}
