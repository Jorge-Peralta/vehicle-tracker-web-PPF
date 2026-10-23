/**
 * Dates are shown in Honduras time (America/Tegucigalpa, UTC-6, no daylight saving),
 * the same time zone the API uses for the `from`/`to` day filters.
 */
export const BUSINESS_TIME_ZONE = 'America/Tegucigalpa'

const dateTimeFormatter = new Intl.DateTimeFormat('es-HN', {
  timeZone: BUSINESS_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** "2026-03-10T14:30:00.000Z" -> "10/03/2026, 08:30" */
export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(new Date(value))
}

/** Local calendar day of a Date as "YYYY-MM-DD", the format of the API's date filters. */
export function toDateParam(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** "YYYY-MM-DD" -> Date at local midnight, or undefined if the text isn't a valid date. */
export function parseDateParam(value: string | null | undefined): Date | undefined {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return undefined
  const [, year, month, day] = match.map(Number) as [number, number, number, number]
  const date = new Date(year, month - 1, day)
  return date.getMonth() === month - 1 ? date : undefined
}

const businessDayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** The last `count` Honduras calendar days as "YYYY-MM-DD", oldest first and ending today. */
export function lastBusinessDays(count: number, now: Date = new Date()): string[] {
  // Numeric parts, not the formatted string, so the result doesn't depend on a locale's layout.
  // Taken as UTC midnight, so subtracting whole days is exact.
  const parts = businessDayFormatter.formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((entry) => entry.type === type)!.value)
  const today = Date.UTC(part('year'), part('month') - 1, part('day'))
  return Array.from({ length: count }, (_, index) =>
    new Date(today - (count - 1 - index) * MS_PER_DAY).toISOString().slice(0, 10),
  )
}

const dayLabelFormatter = new Intl.DateTimeFormat('es-HN', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
})

/** "2026-03-10" -> "mar 10", a compact label for chart axes. */
export function formatDayLabel(day: string): string {
  const parts = dayLabelFormatter.formatToParts(new Date(`${day}T00:00:00Z`))
  const weekday = parts.find((part) => part.type === 'weekday')?.value.replace('.', '') ?? ''
  const dayOfMonth = parts.find((part) => part.type === 'day')?.value ?? ''
  return `${weekday} ${dayOfMonth}`
}

/** Current time without seconds, the precision of the date-time picker. */
export function nowToTheMinute(): Date {
  const now = new Date()
  now.setSeconds(0, 0)
  return now
}
