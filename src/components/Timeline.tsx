import { useItems } from '@/contexts/ItemsContext';
import ZoomControls from '@/components/ZoomControls';
import EventLegend from '@/components/EventLegend';
import TimelineContainer from '@/components/TimelineContainer';

/**
 * Timeline orchestrator component
 *
 * Main orchestrator that coordinates all timeline functionality:
 * - Manages state through custom hooks (zoom, layout, markers)
 * - Composes child components for visualization
 * - Handles data flow between components
 */
export default function Timeline() {
  const items = useItems();
  
  if (!items.length) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        No timeline items to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ZoomControls />
      <TimelineContainer />
      <EventLegend />
    </div>
  );
}
