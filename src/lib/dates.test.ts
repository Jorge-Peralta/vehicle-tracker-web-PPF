import { describe, expect, it } from 'vitest'
import {
  formatDateTime,
  formatDayLabel,
  lastBusinessDays,
  parseDateParam,
  toDateParam,
} from './dates'

describe('lastBusinessDays', () => {
  it('lists the last N Honduras days, oldest first, ending today', () => {
    expect(lastBusinessDays(3, new Date('2026-03-10T14:30:00.000Z'))).toEqual([
      '2026-03-08',
      '2026-03-09',
      '2026-03-10',
    ])
  })

  it('uses the Honduras day, not the UTC day', () => {
    // 03:00 UTC on Mar 1 is still Feb 28 in Honduras; crosses the month boundary.
    expect(lastBusinessDays(2, new Date('2026-03-01T03:00:00.000Z'))).toEqual([
      '2026-02-27',
      '2026-02-28',
    ])
  })
})

describe('formatDayLabel', () => {
  it('shows a short weekday and day of month', () => {
    expect(formatDayLabel('2026-03-10')).toBe('mar 10')
  })
})

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
