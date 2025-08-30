import timelineItems from '@/data/timelineItems';
import Timeline from './components/Timeline';

function App() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Timeline Visualization
          </h1>
          <p className="text-muted-foreground">
            Interactive timeline with intelligent lane sharing and zoom
            functionality
          </p>
        </header>

        <Timeline items={timelineItems} />
      </div>
    </div>
  );
}

export default App;
