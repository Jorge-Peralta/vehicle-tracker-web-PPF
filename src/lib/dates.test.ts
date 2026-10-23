import { describe, expect, it } from 'vitest'
import { formatDateTime, parseDateParam, toDateParam } from './dates'

describe('formatDateTime', () => {
  it('shows the instant in Honduras time (UTC-6), whatever the machine time zone', () => {
    expect(formatDateTime('2026-03-10T14:30:00.000Z')).toBe('10/03/2026, 08:30')
    // 03:00 UTC is still the previous day in Honduras.
    expect(formatDateTime('2026-03-10T03:00:00.000Z')).toBe('09/03/2026, 21:00')
  })
})

describe('toDateParam', () => {
  it('formats the local calendar day as YYYY-MM-DD', () => {
    expect(toDateParam(new Date(2026, 2, 5, 23, 59))).toBe('2026-03-05')
  })
})

describe('parseDateParam', () => {
  it('parses a YYYY-MM-DD day as local midnight', () => {
    expect(parseDateParam('2026-03-05')).toEqual(new Date(2026, 2, 5))
  })

  it('round-trips with toDateParam', () => {
    expect(toDateParam(parseDateParam('2026-12-31')!)).toBe('2026-12-31')
  })

  it('rejects other formats and impossible dates', () => {
    expect(parseDateParam('05/03/2026')).toBeUndefined()
    expect(parseDateParam('2026-02-30')).toBeUndefined()
    expect(parseDateParam('')).toBeUndefined()
    expect(parseDateParam(null)).toBeUndefined()
  })
})
