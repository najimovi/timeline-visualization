import { TIME_MARKER_THRESHOLDS } from '@/lib/constants';

/**
 * Calculates optimal day marker interval based on zoom level
 * Uses progressive disclosure principle - more detail at higher zoom levels
 *
 * @param zoomLevel - Current zoom level
 * @returns Number of days between markers
 */
export const calculateOptimalDayStep = (zoomLevel: number): number => {
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
