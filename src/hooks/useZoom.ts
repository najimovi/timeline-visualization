import { useZoomContext } from '@/contexts/ZoomContext';
export type { ZoomConfig, ZoomControls } from '@/contexts/ZoomContext';

/**
 * Hook to access shared zoom state from ZoomContext
 *
 * This hook provides access to the centralized zoom state that is shared
 * across all components. It ensures consistent zoom behavior throughout
 * the application.
 *
 * @returns Complete zoom control interface from context
 */
export const useZoom = () => {
  return useZoomContext();
};
