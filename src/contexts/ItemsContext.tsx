import React, { createContext, useContext } from 'react';
import type { TimelineItem } from '@/hooks/useTimelineLayout';

const ItemsContext = createContext<TimelineItem[] | undefined>(undefined);

interface ItemsProviderProps {
  children: React.ReactNode;
  items: TimelineItem[];
}

export function ItemsProvider({ children, items }: ItemsProviderProps) {
  return <ItemsContext.Provider value={items}>{children}</ItemsContext.Provider>;
}

export function useItems(): TimelineItem[] {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}