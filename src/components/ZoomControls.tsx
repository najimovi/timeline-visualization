import { ZoomIn, ZoomOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useZoom } from '@/hooks/useZoom';

export default function ZoomControls() {
  const {
    zoomPercentage,
    handleZoomIn,
    handleZoomOut,
    canZoomIn,
    canZoomOut,
  } = useZoom();
  return (
    <div className="flex items-center gap-2">
      <button
        className={twMerge(
          'ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          !canZoomOut && 'cursor-not-allowed opacity-50',
        )}
        onClick={handleZoomOut}
        disabled={!canZoomOut}
        aria-label="Zoom out timeline"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <span className="text-muted-foreground min-w-[3rem] px-2 text-center text-sm">
        {zoomPercentage}
      </span>
      <button
        className={twMerge(
          'ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          !canZoomIn && 'cursor-not-allowed opacity-50',
        )}
        onClick={handleZoomIn}
        disabled={!canZoomIn}
        aria-label="Zoom in timeline"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
}
