import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { ListMovementsParams, MovementType } from '../../../api/types'
import { parseDateParam } from '../../../lib/dates'

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
const DEFAULT_PAGE_SIZE = 20

export type MovementFilters = {
  from?: string
  to?: string
  vehicleId?: number
  driverId?: number
  type?: MovementType
  page: number
  pageSize: number
}

function positiveInteger(value: string | null): number | undefined {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}

/** Reads filters from the URL, ignoring invalid values so a hand-edited link never breaks the page. */
function parseFilters(searchParams: URLSearchParams): MovementFilters {
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const type = searchParams.get('type')
  const pageSize = positiveInteger(searchParams.get('pageSize'))

  return {
    from: parseDateParam(from) ? from! : undefined,
    to: parseDateParam(to) ? to! : undefined,
    vehicleId: positiveInteger(searchParams.get('vehicleId')),
    driverId: positiveInteger(searchParams.get('driverId')),
    type: type === 'ENTRY' || type === 'EXIT' ? type : undefined,
    page: positiveInteger(searchParams.get('page')) ?? 1,
    pageSize:
      pageSize && (PAGE_SIZE_OPTIONS as readonly number[]).includes(pageSize)
        ? pageSize
        : DEFAULT_PAGE_SIZE,
  }
}

/**
 * Movement list filters kept in the URL query string, so a filtered view survives a refresh
 * and can be shared as a link.
 */
export function useMovementFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  /** Changes filters; any change other than the page itself goes back to page 1. */
  const updateFilters = useCallback(
    (changes: Partial<MovementFilters>) => {
      setSearchParams((current) => {
        const next = { ...parseFilters(current), ...changes }
        if (!('page' in changes)) next.page = 1

        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(next)) {
          const isDefault =
            (key === 'page' && value === 1) || (key === 'pageSize' && value === DEFAULT_PAGE_SIZE)
          if (value !== undefined && value !== null && value !== '' && !isDefault) {
            params.set(key, String(value))
          }
        }
        return params
      })
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  const hasActiveFilters = Boolean(
    filters.from || filters.to || filters.vehicleId || filters.driverId || filters.type,
  )

  // A single selected day: `to` defaults to `from` (the API treats both as inclusive).
  const apiParams: ListMovementsParams = {
    ...filters,
    to: filters.to ?? filters.from,
  }

  return { filters, apiParams, updateFilters, clearFilters, hasActiveFilters }
}
