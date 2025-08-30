# Timeline Visualization

A React timeline visualization that displays the events provided in a compact way using a layout algorithm to auto accommodate items in the UI avoiding overlapping.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173); will automatically render the sample data from `src/data/timelineItems.ts`.

## Core Philosophy

#### KISS (Keep It Simple, Stupid)

Evident in the pragmatic decision to inline single-use functions and avoid unnecessary abstraction layers.

#### YAGNI (You Aren't Gonna Need It)

Resisted adding features like filtering, multi-select, or drag-and-drop without explicit requirements.

#### Component-First Architecture

Each component has single responsibility with co-located styles and logic.

#### SOLID Principles

- **Single Responsibility**: Each hook handles one concern
- **Open/Closed**: Extensible via props without modifying core logic
- **Liskov Substitution**: Components are interchangeable
- **Interface Segregation**: Minimal, focused interfaces
- **Dependency Inversion**: Components depend on abstractions (hooks)

## Implementation Overview

### 1. Time Spent

- **5 hours**: Used the full time allocation to deliver a comprehensive solution that balances feature completeness with code quality. Note: didn't do it all in one sitting had to pause several times, so 5 hours is the sum of all the "coding sessions".

### 2. What I Like About My Implementation

- **Clean Code Practices**
  - **Single Responsibility Principle**: Each component and hook has a focused purpose
  - **Descriptive Naming**: Clear and consistent naming conventions
  - **Modular Structure**: Logical file organization enhancing maintainability
- **Quality of Life**
  - **Tailwind CSS**: For rapid styling and responsive design
  - **TypeScript**: For type safety and better developer experience
  - **Vite**: For fast development builds and HMR
  - **ESLint + Prettier**: To enforce code quality and consistency
- **Rendering Algorithms**
  - **Greedy Lane Assignment**: Algorithm that minimizes vertical space while maintaining readability
  - **Smart Label Positioning**: Dynamic text placement based on calculated bar width thresholds
  - **Collision Detection**: Overlap prevention using date-based positioning
- **Performance-First Design**
  - `React.memo` / `useCallback` / `useMemo`: to prevent unnecessary re-renders
  - **Viewport-aware optimizations** for different screen sizes
- **UX Features**
  - **Responsive Zoom**: 50%-400% range with adaptive time marker density
  - **Color Palette**: High-contrast palette ensuring visual distinction
  - **Axis Labels**: To more easily identify days/months
  - **Tooltips**: With complete event information
- **Specialized Hooks**: Made use of React hooks to externalize several sections of the logic:
  - `useTimelineLayout`: Lane allocation algorithm preventing overlaps
  - `useTimeMarkers`: Zoom-responsive date calculations with viewport awareness
  - `useZoom`: Performance-optimized zoom management with boundary states
  - `useMaxLanes` & `useTimelineBounds`: Utility hooks following single responsibility principle

### 3. What I Would Change If Starting Over

- **Research Prior Art**: Investigate existing/efficient approaches to solving overlap and apply
- **Use D3.js (if possible)**: Consider it if this were to grow/continue.
- **UX**
  - **Events Hover Features**: Improve interactivity by bringing hovered events to the front and/or highlighting them
  - **Additional Interactions**: Help users better explore the timeline
- **Architecture Enhancements**
  - **Design System**: Storybook for isolated component development and documentation
  - **Error Boundaries**: To gracefully handle runtime errors in production
  - **Observability**: Integrate Sentry/DataDog for error/performance monitoring
- **Testing Infrastructure**
  - **Test-Driven Development**: Start with comprehensive test suite using Vitest + React Testing Library
  - **Visual Regression Testing**: To guarantee UI consistency
  - **Performance Benchmarks**: Establish baseline metrics for tracking and further optimizations
- **Component Design**
  - **Compound Components Pattern**: Refactor to `<Timeline.Container>`, `<Timeline.Event>` for better composability
- **Accessibility (a11y)**
  - **WCAG 2.1 AA Compliance**: Keyboard navigation, screen reader support, color contrast compliance, focus management, etc
  - **Color Blind Modes**: Alternative palettes, patterns for distinction
  - **Reduced Motion**: Respect `prefers-reduced-motion` settings
- **Given More Time / Nice To Have Improvements**
  - **Use React 19 Compiler**: Remove manual memoization and let it optimize
  - **Allow users to add events**: dynamically accommodate in timeline
  - **Optional Features**: Tackle drag-and-drop, inline editing, others
  - **Filtering/Search**: Real-time event filtering with Fuse.js
  - **Export Functionality**: PNG/SVG/PDF generation
  - **AI-Powered Development Setup**: Claude Code with specialized agents, commands and hooks
  - **Pre-commit Hooks**: Prettier, ESLint, Husky, type-check, test:staged, Conventional Commits
  - **PR Templates**: Checklist ensuring quality standards
  - **Error Boundaries**: Graceful degradation strategies
  - **Observability**: Sentry, DataDog, custom analytics
  - **Dynamic Inline Styling**: work around dynamic stylings that can't be covered by Tailwind via a different complementary solution
  - **CI/CD Pipeline**: Robust pipeline, GitHub Actions sample workflow:

  ```yaml
  - Performance budgets (Lighthouse CI, Core Web Vitals)
  - Security scanning (Snyk, CodeQL)
  - Semantic commits enforcement (commitlint)
  - Visual regression testing
  - Automated versioning (semantic-release)
  - Automated dependency updates
  ```

### 4. Design Decisions and Inspirations

- **Architectural**
  - **Project Structure**: SRP-focused with clear separation of concerns

    ```bash
    ├── index.html                     # Vite entry point
    ├── src/
    │   ├── main.tsx                   # React entry point
    │   ├── App.tsx                    # Main App component
    │   ├── components/
    │   │   ├── Timeline.tsx           # Main orchestrator
    │   │   ├── TimelineContainer.tsx  # Container wrapper
    │   │   ├── TimelineEvent.tsx      # Individual timeline event
    │   │   ├── TimelineEvents.tsx     # Events collection renderer
    │   │   ├── TimelineGrid.tsx       # Background grid lines
    │   │   ├── TimeMarkers.tsx        # Month/day markers
    │   │   ├── ZoomControls.tsx       # Zoom control buttons
    │   │   └── EventLegend.tsx        # Bottom summary legend
    │   ├── hooks/
    │   │   ├── useTimelineLayout.ts   # Lane allocation algorithm
    │   │   ├── useTimeMarkers.ts      # Time marker calculations
    │   │   ├── useZoom.ts             # Zoom state management
    │   │   ├── useMaxLanes.ts         # Max lanes calculation
    │   │   └── useTimelineBounds.ts   # Timeline date bounds
    │   ├── lib/
    │   │   ├── constants.ts           # Colors, dimensions, constants
    │   │   ├── calculations.ts        # Math and layout calculations
    │   │   └── formatters.ts          # Date formatting utilities
    │   ├── data/
    │   │   └── timelineItems.ts       # Provided timeline events
    ├── vite.config.ts                 # Vite configuration with @ aliases
    ├── tailwind.config.ts             # Tailwind CSS configuration
    ├── .prettierrc.json               # Prettier configuration with Tailwind plugin
    └── tsconfig.json                  # TypeScript configuration


    ```

  - **Sample Data**: Automatically loads 14 events from `src/data/timelineItems.ts`
  - **Vite Minimalist Setup**: follow Vite's minimalist but robust out of the box suggested structure

- **Tech Stack**
  - **React 19**: Latest stable version
  - **TypeScript**: Chosen for:
    - **Type Safety**: Catches errors at compile-time, not runtime
    - **IntelliSense**: Superior IDE support accelerating development
    - **Refactoring Confidence**: Safe large-scale changes
    - **Documentation**: Types serve as inline documentation
    - **Team Scalability**: Onboarding ease with explicit contracts
  - **Tailwind CSS**: Utility-first styling for rapid UI development, responsive design
  - **Vite**: Lightweight approach, fast HMR, optimized builds, zero-config TypeScript
- **Inspiration Sources**
  - Greedy algorithms (<https://en.wikipedia.org/wiki/Interval_graph>, <https://www.cs.princeton.edu/~wayne/kleinberg-tardos/pearson/04GreedyAlgorithms>), label collision (<https://docs.mapbox.com/help/troubleshooting/optimize-map-label-placement/?utm_source=chatgpt.com>),
  - Dribble, Coolors
- **Type Colocation Strategy**
  - Deliberately kept interfaces (e.g. `TimelineItem`) within their immediate usage rather than creating a `/types` folder avoiding premature abstraction.

### 5. How I Would Test This Component

- **Base Test Infrastructure**
  - **Coverage Policy**: Minimum 80%+ enforced via CI/CD
  - **Pre-commit Hooks**: Husky + lint-staged running tests on changed files
  - **Test Utilities**: Custom render wrappers
  - **Continuous Testing**: GitHub Actions running full suite on PR
  - **Cyclomatic complexity**: < 10 per function
- **Performance Testing**
  - **Lighthouse CI/Core Web Vitals**: Automated performance budgets
    - **LCP (Largest Contentful Paint)**: < 2.5s via code splitting
    - **FID (First Input Delay)**: < 100ms with React 19 optimizations
    - **CLS (Cumulative Layout Shift)**: < 0.1 with fixed dimensions
  - **Bundle Optimization**: Ensure tree-shaking effectiveness, dynamic imports for large dependencies
  - **React DevTools Profiler**: Measure render times and identify bottlenecks
- **Unit Testing**: Via Vitest + React Testing Library eg:
  - **Components**: Snapshot tests, interaction tests (hover, focus)
  - **Hooks**: Isolated logic tests with various input scenarios
  - **Utilities**: Pure function tests with edge cases
- **E2E Testing**: Via Playwright

### 6. Build and Run Instructions

#### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ (bundled with Node.js)

#### Development

```bash
# Clone repository
git clone <repository-url>
cd events-timeline

# Install dependencies
npm install

# Start development server with HMR
npm run dev
# Opens at http://localhost:5173
```

#### Production Build

```bash
# Type-check and build
npm run build

# Preview production build locally
npm run preview
# Serves at http://localhost:4173
```

## React 19 Considerations

- While using React 19, the implementation remains conservative:
  - **Avoided Latest Features**: No use of Server Components or Actions (stability)
  - **Compiler Benefits Unutilized**: Manual memoization still applied (could be removed)
  - **Future Migration Path**: Ready for React Compiler optimizations when stable

---
