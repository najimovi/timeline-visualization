import { useMemo, useEffect, useState } from 'react';
import type { ProcessedItem } from './useTimelineLayout';
import { calculateOptimalDayStep } from '@/lib/calculations';

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
 * Zoom-responsive behavior (Desktop):
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
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return useMemo(() => {
    if (!processedItems.length) return { months: [], days: [] };

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
    // Set to noon to avoid timezone issues
    monthCurrent.setHours(12, 0, 0, 0);

    while (monthCurrent <= maxDate) {
      const position =
        ((monthCurrent.getTime() - minDate.getTime()) / totalDuration) * 100;

      // Only add month markers that are at or after the timeline start
      if (position >= -0.1) {
        // Small tolerance for rounding
        monthMarkers.push({
          date: new Date(monthCurrent),
          position: Math.max(0, position), // Ensure position is never negative
        });
      }

      // Advance to next month using native Date methods for accuracy
      monthCurrent.setMonth(monthCurrent.getMonth() + 1);
    }

    // Generate adaptive day markers based on zoom level
    const dayMarkers: TimeMarker[] = [];

    // Start from minDate, set to noon to avoid timezone issues
    const dayCurrent = new Date(minDate);
    dayCurrent.setHours(12, 0, 0, 0);

    // Smart zoom-responsive density algorithm
    const dayStep = calculateOptimalDayStep(zoomLevel, viewportWidth);

    while (dayCurrent <= maxDate) {
      // Calculate position relative to timeline start
      const position =
        ((dayCurrent.getTime() - minDate.getTime()) / totalDuration) * 100;

      // Only add markers that are within or after the timeline start
      // The position check ensures we don't show markers before the timeline
      if (position >= -0.1) {
        dayMarkers.push({
          date: new Date(dayCurrent),
          position: Math.max(0, position),
        });
      }

      // Advance by calculated step size
      dayCurrent.setDate(dayCurrent.getDate() + dayStep);
    }

    return {
      months: monthMarkers,
      days: dayMarkers,
    };
  }, [processedItems, zoomLevel, viewportWidth]);
};
