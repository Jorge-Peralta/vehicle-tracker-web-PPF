import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { useMovementFilters } from './use-movement-filters'

/** Query string as a plain object, so assertions don't depend on parameter order. */
function queryOf(search: string) {
  return Object.fromEntries(new URLSearchParams(search))
}

/** Renders the hook at `url` and exposes the current query string next to its result. */
function renderFilters(url: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )
  return renderHook(() => ({ ...useMovementFilters(), search: useLocation().search }), { wrapper })
}

describe('useMovementFilters', () => {
  it('reads every filter from the URL', () => {
    const { result } = renderFilters(
      '/movements?from=2026-03-01&to=2026-03-10&vehicleId=3&driverId=7&type=EXIT&page=2&pageSize=50',
    )

    expect(result.current.filters).toEqual({
      from: '2026-03-01',
      to: '2026-03-10',
      vehicleId: 3,
      driverId: 7,
      type: 'EXIT',
      page: 2,
      pageSize: 50,
    })
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it('ignores invalid values instead of sending them to the API', () => {
    const { result } = renderFilters(
      '/movements?from=10/03/2026&vehicleId=abc&driverId=-2&type=IN&page=0&pageSize=7',
    )

    expect(result.current.filters).toEqual({
      from: undefined,
      to: undefined,
      vehicleId: undefined,
      driverId: undefined,
      type: undefined,
      page: 1,
      pageSize: 20,
    })
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it('uses `from` as `to` when only one day is selected', () => {
    const { result } = renderFilters('/movements?from=2026-03-10')

    expect(result.current.apiParams).toMatchObject({ from: '2026-03-10', to: '2026-03-10' })
  })

  it('goes back to page 1 when a filter changes', () => {
    const { result } = renderFilters('/movements?page=3&type=ENTRY')

    act(() => result.current.updateFilters({ vehicleId: 5 }))

    expect(result.current.filters.page).toBe(1)
    expect(queryOf(result.current.search)).toEqual({ type: 'ENTRY', vehicleId: '5' })
  })

  it('keeps the other filters when only the page changes', () => {
    const { result } = renderFilters('/movements?type=ENTRY')

    act(() => result.current.updateFilters({ page: 2 }))

    expect(queryOf(result.current.search)).toEqual({ type: 'ENTRY', page: '2' })
  })

  it('leaves defaults and cleared filters out of the URL', () => {
    const { result } = renderFilters('/movements?type=ENTRY&page=2')

    act(() => result.current.updateFilters({ type: undefined, pageSize: 20 }))

    expect(result.current.search).toBe('')
  })

  it('clears every filter', () => {
    const { result } = renderFilters('/movements?type=ENTRY&vehicleId=3&page=2')

    act(() => result.current.clearFilters())

    expect(result.current.search).toBe('')
    expect(result.current.hasActiveFilters).toBe(false)
  })
})
