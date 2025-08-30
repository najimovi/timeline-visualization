import { useMemo } from 'react';
import type { ProcessedItem } from './useTimelineLayout';

export interface TimeMarker {
  date: Date;
  position: number;
}

export interface TimeMarkersResult {
  months: TimeMarker[];
  days: TimeMarker[];
}

interface UseTimeMarkersProps {
  processedItems: ProcessedItem[];
  zoomLevel: number;
}

/**
 * Advanced time markers hook that generates intelligent date markers based on timeline data
 *
 * Features:
 * - Adaptive marker density based on zoom level
 * - Precise date boundary calculations
 * - Optimized date iteration algorithms
 * - Smart positioning with percentage-based coordinates
 * - Month boundary detection and alignment
 *
 * Zoom-responsive behavior:
 * - < 0.7x: Bi-weekly markers (14 day intervals)
 * - 0.7x - 1.0x: Weekly markers (7 day intervals)
 * - 1.0x - 1.5x: Every 3 days
 * - > 1.5x: Daily markers (maximum detail)
 *
 * @param processedItems - Timeline items with calculated positions
 * @param zoomLevel - Current zoom level affecting marker density
 * @returns Object containing month and day marker arrays
 */
export const useTimeMarkers = ({
  processedItems,
  zoomLevel,
}: UseTimeMarkersProps): TimeMarkersResult => {
  return useMemo(() => {
    // Early return for empty timeline
    if (!processedItems.length) return { months: [], days: [] };

    // Calculate timeline bounds from processed items
    const minDate = new Date(
      Math.min(...processedItems.map((item) => item.startDate.getTime())),
    );
    const maxDate = new Date(
      Math.max(...processedItems.map((item) => item.endDate.getTime())),
    );
    const totalDuration = maxDate.getTime() - minDate.getTime();

    // Generate month boundary markers
    const monthMarkers: TimeMarker[] = [];
    const monthCurrent = new Date(minDate);

    // Align to month boundary for clean visual separation
    monthCurrent.setDate(1);
    monthCurrent.setHours(0, 0, 0, 0);

    while (monthCurrent <= maxDate) {
      const position =
        ((monthCurrent.getTime() - minDate.getTime()) / totalDuration) * 100;
      monthMarkers.push({
        date: new Date(monthCurrent),
        position,
      });

      // Advance to next month using native Date methods for accuracy
      monthCurrent.setMonth(monthCurrent.getMonth() + 1);
    }

    // Generate adaptive day markers based on zoom level
    const dayMarkers: TimeMarker[] = [];
    const dayCurrent = new Date(minDate);
    dayCurrent.setHours(0, 0, 0, 0); // Normalize to day boundary

    // Smart zoom-responsive marker density algorithm
    const dayStep = calculateOptimalDayStep(zoomLevel);

    while (dayCurrent <= maxDate) {
      const position =
        ((dayCurrent.getTime() - minDate.getTime()) / totalDuration) * 100;
      dayMarkers.push({
        date: new Date(dayCurrent),
        position,
      });

      // Advance by calculated step size
      dayCurrent.setDate(dayCurrent.getDate() + dayStep);
    }

    return {
      months: monthMarkers,
      days: dayMarkers,
    };
  }, [processedItems, zoomLevel]);
};

/**
 * Calculates optimal day marker interval based on zoom level
 * Uses progressive disclosure principle - more detail at higher zoom levels
 *
 * @param zoomLevel - Current zoom level
 * @returns Number of days between markers
 */
const calculateOptimalDayStep = (zoomLevel: number): number => {
  if (zoomLevel < 0.7) {
    return 14; // Bi-weekly markers when zoomed out - prevents overcrowding
  } else if (zoomLevel < 1) {
    return 7; // Weekly markers for moderate zoom - good balance
  } else if (zoomLevel < 1.5) {
    return 3; // Every 3 days when getting detailed - more granular
  } else {
    return 1; // Daily markers at high zoom - maximum detail
  }
};
