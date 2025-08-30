/**
 * Formats a date for month display in timeline headers
 * @param date - Date to format
 * @returns Formatted month string (e.g., "Jan 2024")
 */
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a date for day display in timeline markers
 * @param date - Date to format
 * @returns Formatted day string (e.g., "01/15")
 */
export const formatDayMonth = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  });
};
