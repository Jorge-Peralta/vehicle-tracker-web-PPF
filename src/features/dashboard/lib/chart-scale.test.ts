import { describe, expect, it } from 'vitest'
import { niceMax } from './chart-scale'

describe('niceMax', () => {
  it('keeps a minimum axis of 4 for small or empty values', () => {
    expect(niceMax(0)).toBe(4)
    expect(niceMax(3)).toBe(4)
    expect(niceMax(-Infinity)).toBe(4)
  })

  it('rounds up to an even multiple of a 1-2-5 step', () => {
    expect(niceMax(7)).toBe(10)
    expect(niceMax(12)).toBe(20)
    expect(niceMax(45)).toBe(100)
    expect(niceMax(150)).toBe(200)
  })
})
