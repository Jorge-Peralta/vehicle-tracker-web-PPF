import { describe, expect, it } from 'vitest'
import { formatMileage, formatPlate } from './formatters'

describe('formatPlate', () => {
  it('adds the space between letters and digits', () => {
    expect(formatPlate('HAA1234')).toBe('HAA 1234')
  })

  it('leaves values that are not a stored plate unchanged', () => {
    expect(formatPlate('HAA 1234')).toBe('HAA 1234')
    expect(formatPlate('ABC')).toBe('ABC')
  })
})

describe('formatMileage', () => {
  it('groups thousands and adds the unit', () => {
    expect(formatMileage(15230)).toBe('15,230 km')
    expect(formatMileage(0)).toBe('0 km')
  })
})
