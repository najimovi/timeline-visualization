import timelineItems from '@/data/timelineItems';
import Timeline from './components/Timeline';
import { ZoomProvider } from '@/contexts/ZoomContext';
import { ItemsProvider } from '@/contexts/ItemsContext';

function App() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Timeline Visualization
          </h1>
        </header>
        <main>
          <ItemsProvider items={timelineItems}>
            <ZoomProvider>
              <Timeline />
            </ZoomProvider>
          </ItemsProvider>
        </main>
      </div>
    </div>
  );
}

export default App;
