import { useMemo } from "react"
import type { ProcessedItem } from "./useTimelineLayout"

/**
 * Utility hook to get maximum number of lanes from processed items
 */
export const useMaxLanes = (processedItems: ProcessedItem[]): number => {
  return useMemo(() => {
    if (!processedItems.length) return 0
    return Math.max(...processedItems.map((item) => item.lane), 0) + 1
  }, [processedItems])
}