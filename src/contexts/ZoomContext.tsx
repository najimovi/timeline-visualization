import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';

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

const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
  min: 0.5,
  max: 4,
  step: 1.5,
  initial: 1,
};

const ZoomContext = createContext<ZoomControls | undefined>(undefined);

interface ZoomProviderProps {
  children: React.ReactNode;
  config?: Partial<ZoomConfig>;
}

export function ZoomProvider({ children, config = {} }: ZoomProviderProps) {
  const zoomConfig = useMemo(
    () => ({
      ...DEFAULT_ZOOM_CONFIG,
      ...config,
    }),
    [config],
  );

  const [zoomLevel, setZoomLevel] = useState(zoomConfig.initial);

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

  const canZoomIn = useMemo(() => {
    return zoomLevel < zoomConfig.max;
  }, [zoomLevel, zoomConfig.max]);

  const canZoomOut = useMemo(() => {
    return zoomLevel > zoomConfig.min;
  }, [zoomLevel, zoomConfig.min]);

  const zoomPercentage = useMemo(() => {
    return `${Math.round(zoomLevel * 100)}%`;
  }, [zoomLevel]);

  const value = useMemo(
    () => ({
      zoomLevel,
      handleZoomIn,
      handleZoomOut,
      canZoomIn,
      canZoomOut,
      zoomPercentage,
      resetZoom,
    }),
    [
      zoomLevel,
      handleZoomIn,
      handleZoomOut,
      canZoomIn,
      canZoomOut,
      zoomPercentage,
      resetZoom,
    ],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

export function useZoomContext(): ZoomControls {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoomContext must be used within a ZoomProvider');
  }
  return context;
}
