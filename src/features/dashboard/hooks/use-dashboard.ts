import { useQueries } from '@tanstack/react-query'
import type { ListMovementsParams, MovementType } from '../../../api/types'
import { lastBusinessDays } from '../../../lib/dates'
import { fetchMovements } from '../../movements/api/movements-api'
import { movementKeys } from '../../movements/hooks/use-movements'

export const ACTIVITY_DAYS = 7

const MOVEMENT_TYPES: MovementType[] = ['ENTRY', 'EXIT']

export type DailyActivity = {
  /** "YYYY-MM-DD" in Honduras time. */
  day: string
  entries: number
  exits: number
}

/**
 * Entries and exits per day over the last week. The API has no aggregate endpoint, so each
 * day and type asks for one row and reads `total`; under `movementKeys` so a new movement
 * refreshes them.
 */
export function useDailyActivity() {
  const days = lastBusinessDays(ACTIVITY_DAYS)
  const requests = days.flatMap((day) =>
    MOVEMENT_TYPES.map((type): ListMovementsParams => ({ from: day, to: day, type, pageSize: 1 })),
  )

  return useQueries({
    queries: requests.map((params) => ({
      queryKey: movementKeys.list(params),
      queryFn: () => fetchMovements(params),
      select: (page: { total: number }) => page.total,
    })),
    combine: (results) => ({
      data: results.every((result) => result.isSuccess)
        ? days.map((day, index): DailyActivity => ({
            day,
            entries: results[index * 2]!.data!,
            exits: results[index * 2 + 1]!.data!,
          }))
        : undefined,
      isPending: results.some((result) => result.isPending),
      error: results.find((result) => result.error)?.error ?? null,
      refetch: () => Promise.all(results.map((result) => result.refetch())),
    }),
  })
}
