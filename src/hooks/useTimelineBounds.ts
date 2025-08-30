import { useMemo } from "react"
import type { ProcessedItem } from "./useTimelineLayout"

/**
 * Utility hook to get timeline date bounds from processed items
 * Useful for other components that need timeline range information
 */
export const useTimelineBounds = (processedItems: ProcessedItem[]) => {
  return useMemo(() => {
    if (!processedItems.length) {
      return { minDate: null, maxDate: null, totalDuration: 0 }
    }

    const minDate = new Date(Math.min(...processedItems.map((item) => item.startDate.getTime())))
    const maxDate = new Date(Math.max(...processedItems.map((item) => item.endDate.getTime())))
    const totalDuration = maxDate.getTime() - minDate.getTime()

    return { minDate, maxDate, totalDuration }
  }, [processedItems])
}