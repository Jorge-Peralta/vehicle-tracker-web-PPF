import { useQuery } from '@tanstack/react-query'
import { lastBusinessDays } from '../../../lib/dates'
import { fetchDailySummary } from '../../movements/api/movements-api'
import { movementKeys } from '../../movements/hooks/use-movements'

export const ACTIVITY_DAYS = 7

/**
 * Entries and exits per day over the last week, in one request. Under `movementKeys`
 * so registering a movement refreshes it.
 */
export function useDailyActivity() {
  const days = lastBusinessDays(ACTIVITY_DAYS)
  const params = { from: days[0]!, to: days.at(-1)! }

  return useQuery({
    queryKey: [...movementKeys.all, 'daily-summary', params] as const,
    queryFn: () => fetchDailySummary(params),
  })
}
