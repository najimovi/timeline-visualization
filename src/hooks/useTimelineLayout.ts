import { useMemo } from 'react';
import { calculateBarPixelWidth } from '@/lib/calculations';

export interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
}

export interface ProcessedItem extends TimelineItem {
  startDate: Date;
  endDate: Date;
  lane: number;
  duration: number;
  position: number;
  width: number;
  color: string;
}

interface UseTimelineLayoutProps {
  items: TimelineItem[];
  zoomLevel: number;
  colors: readonly string[];
}

/**
 * Advanced timeline layout hook that implements intelligent lane allocation algorithm
 *
 * Features:
 * - Greedy lane assignment for space efficiency (https://en.wikipedia.org/wiki/Interval_graph)
 * - Smart conflict resolution based on text length (https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
 * - Buffer-based overlap prevention (https://docs.mapbox.com/help/troubleshooting/optimize-map-label-placement/)
 * - Adaptive text-fitting logic based on zoom level
 *
 * @param items - Array of timeline events
 * @param zoomLevel - Current zoom level affecting text visibility calculations
 * @param colors - Color palette for event styling
 * @returns Processed items with lane assignments and positioning data
 */
export const useTimelineLayout = ({
  items,
  zoomLevel,
  colors,
}: UseTimelineLayoutProps): ProcessedItem[] => {
  return useMemo(() => {
    if (!items.length) return [];

    // Phase 1: Parse dates and sort chronologically
    // Sorting by start time then greedily assigning to lanes corresponds to interval partitioning / greedy coloring on interval graphs.
    const itemsWithDates = items
      .map((item, index) => ({
        ...item,
        // Parse dates as local midnight to avoid timezone issues
        startDate: new Date(item.start + 'T00:00:00'),
        endDate: new Date(item.end + 'T00:00:00'),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    console.log('Items with dates: ', { itemsWithDates });

    // Phase 2: Calculate timeline bounds and normalization factors
    // Normalizing position to [0,1] is the same mapping idea as a time -> linear scale.
    const minDate = itemsWithDates[0].startDate;
    const maxDate = itemsWithDates.reduce(
      (max, item) => (item.endDate > max ? item.endDate : max),
      itemsWithDates[0].endDate,
    );
    const totalDuration = maxDate.getTime() - minDate.getTime();

    // Phase 3: Intelligent lane allocation with conflict resolution
    const lanes: ProcessedItem[][] = [];
    const processed: ProcessedItem[] = [];

    for (const item of itemsWithDates) {
      // Calculate normalized position and dimensions
      const duration = Math.max(
        item.endDate.getTime() - item.startDate.getTime(),
        86400000,
      ); // Minimum 1 day
      const position =
        (item.startDate.getTime() - minDate.getTime()) / totalDuration;
      const width = Math.max(duration / totalDuration, 0.02);

      // Advanced text-fitting calculation based on zoom level
      const barPixelWidth = calculateBarPixelWidth(width, 1200, zoomLevel);
      // Check if text will fit: estimate 8px per character + 32px padding
      const textWillFit = barPixelWidth > item.name.length * 8 + 32;

      let assignedLane = -1;

      // Greedy lane assignment algorithm (interval partitioning / left-to-right placement)
      for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
        const lane = lanes[laneIndex];
        let canFit = true;

        // Check for conflicts with existing items in this lane
        for (const existingItem of lane) {
          const existingEnd = existingItem.position + existingItem.width;
          const newEnd = position + width;
          const buffer = 0.003; // Small buffer to prevent visual overlap

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
          // Smart conflict resolution: prefer lower lanes for better visibility
          // Skip higher lanes for long text names that won't fit, unless we're running out of space
          if (
            !textWillFit &&
            item.name.length > 20 &&
            laneIndex < 3 &&
            lanes.length < 10
          ) {
            continue; // Try to find a lane where text visibility will be better
          }
          assignedLane = laneIndex;
          break;
        }
      }

      // Create new lane if no suitable lane found
      if (assignedLane === -1) {
        assignedLane = lanes.length;
        lanes.push([]);
      }

      // Create processed item with all calculated properties
      const processedItem: ProcessedItem = {
        ...item,
        lane: assignedLane,
        duration,
        position,
        width,
      };

      console.log('Assigned item to lane: ', assignedLane, { processedItem });
      lanes[assignedLane].push(processedItem);
      processed.push(processedItem);
    }

    return processed;
  }, [items, zoomLevel, colors]);
};
