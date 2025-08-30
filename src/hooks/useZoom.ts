import { useState, useCallback, useMemo } from 'react';

export interface ZoomConfig {
  min: number;
  max: number;
  step: number;
  initial: number;
}

export interface ZoomControls {
  zoomLevel: number;
  handleZoomIn: VoidFunction;
  handleZoomOut: VoidFunction;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomPercentage: string;
  resetZoom: VoidFunction;
}

interface UseZoomProps {
  config?: Partial<ZoomConfig>;
}

// Default zoom configuration optimized for timeline visualization
const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
  min: 0.5, // 50% minimum - prevents timeline from becoming too compressed
  max: 4, // 400% maximum - prevents performance issues with extreme zoom
  step: 1.5, // 1.5x multiplier - provides smooth zoom progression
  initial: 1, // 100% starting zoom - natural baseline
};

/**
 * Advanced zoom management hook with performance optimizations and UX enhancements
 *
 * Features:
 * - Configurable zoom bounds and step size
 * - Performance-optimized event handlers with useCallback
 * - Boundary state management (canZoomIn/canZoomOut)
 * - Formatted zoom percentage for UI display
 * - Reset zoom functionality for user convenience
 * - Smooth zoom progression with exponential steps
 *
 * Performance optimizations:
 * - useCallback for stable handler references (prevents child re-renders)
 * - useMemo for computed values (zoom percentage formatting)
 * - Boundary pre-calculation to avoid redundant state updates
 *
 * @param config - Optional zoom configuration overrides
 * @returns Complete zoom control interface
 */
export const useZoom = ({ config = {} }: UseZoomProps = {}): ZoomControls => {
  // Merge user config with sensible defaults
  const zoomConfig = useMemo(
    () => ({
      ...DEFAULT_ZOOM_CONFIG,
      ...config,
    }),
    [config],
  );

  const [zoomLevel, setZoomLevel] = useState(zoomConfig.initial);

  // Performance-optimized zoom handlers with useCallback
  // These handlers maintain stable references to prevent unnecessary re-renders
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = prev * zoomConfig.step;
      return Math.min(newZoom, zoomConfig.max);
    });
  }, [zoomConfig.step, zoomConfig.max]);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = prev / zoomConfig.step;
      return Math.max(newZoom, zoomConfig.min);
    });
  }, [zoomConfig.step, zoomConfig.min]);

  const resetZoom = useCallback(() => {
    setZoomLevel(zoomConfig.initial);
  }, [zoomConfig.initial]);

  // Memoized boundary calculations for UI state management
  const canZoomIn = useMemo(() => {
    return zoomLevel < zoomConfig.max;
  }, [zoomLevel, zoomConfig.max]);

  const canZoomOut = useMemo(() => {
    return zoomLevel > zoomConfig.min;
  }, [zoomLevel, zoomConfig.min]);

  // Memoized zoom percentage formatting for consistent UI display
  const zoomPercentage = useMemo(() => {
    return `${Math.round(zoomLevel * 100)}%`;
  }, [zoomLevel]);

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    canZoomIn,
    canZoomOut,
    zoomPercentage,
    resetZoom,
  };
};

/**
 * Utility hook for zoom-responsive calculations
 * Useful for components that need to adapt behavior based on zoom level
 */
export const useZoomResponsive = (zoomLevel: number) => {
  return useMemo(
    () => ({
      isZoomedOut: zoomLevel < 0.75,
      isZoomedIn: zoomLevel > 1.25,
      isNormalZoom: zoomLevel >= 0.75 && zoomLevel <= 1.25,
      zoomCategory:
        zoomLevel < 0.75 ? 'out' : zoomLevel > 1.25 ? 'in' : 'normal',
    }),
    [zoomLevel],
  );
};
