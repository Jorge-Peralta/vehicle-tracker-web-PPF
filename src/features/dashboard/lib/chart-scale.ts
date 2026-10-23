/**
 * Smallest "nice" axis maximum above `value`: twice a 1, 2, or 5 × 10ⁿ step, so the middle
 * tick is a round number too. Never below 4, which also covers empty data (-Infinity).
 */
export function niceMax(value: number): number {
  if (!Number.isFinite(value) || value <= 4) return 4
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((factor) => factor * magnitude * 2 >= value)! * magnitude
  return step * 2
}
