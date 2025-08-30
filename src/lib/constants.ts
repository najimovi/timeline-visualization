export const TIMELINE_COLORS = [
  'bg-blue-500 border-blue-600 text-white',
  'bg-emerald-500 border-emerald-600 text-white',
  'bg-purple-500 border-purple-600 text-white',
  'bg-orange-500 border-orange-600 text-white',
  'bg-rose-500 border-rose-600 text-white',
  'bg-cyan-500 border-cyan-600 text-white',
  'bg-amber-500 border-amber-600 text-white',
  'bg-indigo-500 border-indigo-600 text-white',
] as const;

export const TIMELINE_LAYOUT = {
  LANE_HEIGHT: 80, // Vertical space per lane in pixels
  EVENT_HEIGHT: 50, // Height of each event bar
  LANE_VERTICAL_OFFSET: 15, // Top margin for events within lanes
  HEADER_HEIGHT: 250, // Total height for time marker headers
  TIME_MARKER_HEIGHT: 16, // Height of the time marker section
  MINIMUM_BAR_WIDTH: 2, // Minimum width percentage for visibility
  OVERLAP_BUFFER: 0.003, // Buffer to prevent visual overlap (0.3%)
  ESTIMATED_CHAR_WIDTH: 8, // Estimated pixel width per character for text fitting
  TEXT_PADDING: 40, // Minimum padding around text inside bars
  TOOLTIP_OFFSET: 60, // Vertical offset for tooltips
  EDGE_THRESHOLD: 70, // Percentage threshold for tooltip edge detection
} as const;

/**
 * Zoom configuration constants
 */
export const ZOOM_CONFIG = {
  MIN: 0.5, // 50% minimum zoom
  MAX: 4, // 400% maximum zoom
  STEP: 1.5, // 1.5x multiplier for zoom steps
  INITIAL: 1, // 100% starting zoom
} as const;

export const TIME_MARKER_THRESHOLDS = {
  BI_WEEKLY: 0.7, // Below this zoom level: 14 day intervals
  WEEKLY: 1.0, // Below this zoom level: 7 day intervals
  THREE_DAY: 1.5, // Below this zoom level: 3 day intervals
  // Above 1.5x: daily markers
} as const;
