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

/** Current time without seconds, the precision of the date-time picker. */
export function nowToTheMinute(): Date {
  const now = new Date()
  now.setSeconds(0, 0)
  return now
}
