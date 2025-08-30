import { TIME_MARKER_THRESHOLDS } from '@/lib/constants';

/**
 * Calculates optimal day marker interval based on zoom level and viewport
 * TODO: refactor, clean and simplify
 *
 * @param zoomLevel - Current zoom level
 * @param viewportWidth - Optional viewport width for mobile optimization
 * @returns Number of days between markers
 */
export const calculateOptimalDayStep = (
  zoomLevel: number,
  viewportWidth?: number,
): number => {
  const isMobile = viewportWidth !== undefined && viewportWidth < 768;

  if (isMobile) {
    if (zoomLevel >= 1.5 && zoomLevel <= 2.0) {
      return 7; // Force weekly markers to prevent overlap
    }

    // Mobile-optimized intervals
    if (zoomLevel < 0.8) {
      return 14; // Bi-weekly for very zoomed out
    } else if (zoomLevel < 1.5) {
      return 7; // Weekly for low-medium zoom
    } else if (zoomLevel < 2.5) {
      return 5; // Every 5 days for medium-high zoom
    } else {
      return 3; // Every 3 days for high zoom (never daily on mobile)
    }
  }

  // Desktop behavior - full granularity based on zoom
  if (zoomLevel < TIME_MARKER_THRESHOLDS.BI_WEEKLY) {
    return 14; // Bi-weekly markers when zoomed out - prevents overcrowding
  } else if (zoomLevel < TIME_MARKER_THRESHOLDS.WEEKLY) {
    return 7; // Weekly markers for moderate zoom - good balance
  } else if (zoomLevel < TIME_MARKER_THRESHOLDS.THREE_DAY) {
    return 3; // Every 3 days when getting detailed - more granular
  } else {
    return 1; // Daily markers at high zoom - maximum detail
  }
};

/**
 * Calculates the pixel width of a timeline bar
 * @param width - Normalized width (0-1)
 * @param containerWidth - Container width in pixels
 * @param zoomLevel - Current zoom level
 * @returns Pixel width of the bar
 */
export const calculateBarPixelWidth = (
  width: number,
  containerWidth: number,
  zoomLevel: number,
): number => {
  return width * containerWidth * zoomLevel;
};

/**
 * Calculates duration in days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days
 */
export const calculateDurationInDays = (
  startDate: Date,
  endDate: Date,
): number => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
};
