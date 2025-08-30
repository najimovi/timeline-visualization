import React from 'react';
import type { ProcessedItem } from '@/hooks/useTimelineLayout';
import { TIMELINE_LAYOUT } from '@/lib/constants';
import {
  calculateDurationInDays,
  calculateBarPixelWidth,
} from '@/lib/calculations';

interface TimelineEventProps {
  item: ProcessedItem;
  zoomLevel: number;
}

const TimelineEvent = React.memo(({ item, zoomLevel }: TimelineEventProps) => {
  // Calculate bar dimensions and text fitting logic
  const barWidth = Math.max(
    item.width * 100,
    TIMELINE_LAYOUT.MINIMUM_BAR_WIDTH,
  );
  const estimatedTextWidth =
    item.name.length * TIMELINE_LAYOUT.ESTIMATED_CHAR_WIDTH;
  const barPixelWidth = calculateBarPixelWidth(barWidth / 100, 1200, zoomLevel);
  const showTextInside =
    barPixelWidth > estimatedTextWidth + TIMELINE_LAYOUT.TEXT_PADDING;

  return (
    <div
      className="group absolute focus-within:z-40"
      style={{
        left: `${item.position * 100}%`,
        top: `${item.lane * TIMELINE_LAYOUT.LANE_HEIGHT + TIMELINE_LAYOUT.LANE_VERTICAL_OFFSET}px`,
        width: `${barWidth}%`,
        height: `${TIMELINE_LAYOUT.EVENT_HEIGHT}px`,
      }}
      tabIndex={0}
      role="button"
      aria-label={`Event: ${item.name}, from ${item.start} to ${item.end}, lane ${item.lane + 1}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // TODO: Add keyboard interaction
        }
      }}
    >
      {/* Event Bar */}
      <div
        className={`relative h-full rounded-lg border-2 shadow-sm transition-all duration-200 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:shadow-lg ${item.color}`}
      >
        {/* Text Inside Bar (when it fits) */}
        {showTextInside && (
          <div className="absolute inset-0 flex items-center overflow-hidden px-3">
            <span className="overflow-hidden text-sm leading-tight font-medium text-ellipsis whitespace-nowrap">
              {item.name}
            </span>
          </div>
        )}

        {/* Hover Tooltip */}
        <div
          className="pointer-events-none absolute z-30 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            left:
              item.position * 100 > TIMELINE_LAYOUT.EDGE_THRESHOLD
                ? 'auto'
                : '0',
            right:
              item.position * 100 > TIMELINE_LAYOUT.EDGE_THRESHOLD
                ? '0'
                : 'auto',
            top: `-${TIMELINE_LAYOUT.TOOLTIP_OFFSET}px`,
          }}
        >
          <div className="bg-popover border-border rounded-lg border px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="text-popover-foreground text-sm font-semibold">
              {item.name}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {item.start} → {item.end}
            </div>
            <div className="text-muted-foreground text-xs opacity-75">
              Lane {item.lane + 1} • Duration:{' '}
              {calculateDurationInDays(item.startDate, item.endDate)} days
            </div>
          </div>
        </div>
      </div>

      {/* External Label (when text doesn't fit inside) */}
      {!showTextInside && (
        <div
          className="absolute z-20"
          style={{
            left: barWidth < 15 ? `${Math.min(barWidth + 2, 95)}%` : '2px',
            top:
              barWidth < 15
                ? `${15 + item.lane * 2}px`
                : `${55 + item.lane * 3}px`, // Stagger labels by lane to prevent overlap
            maxWidth: '200px',
          }}
        >
          <span className="text-foreground bg-background/95 group-hover:bg-accent group-hover:text-accent-foreground rounded border px-2 py-1 text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur-sm">
            {item.name}
          </span>
        </div>
      )}
    </div>
  );
});

export default TimelineEvent;
