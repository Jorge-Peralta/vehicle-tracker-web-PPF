import { describe, expect, it } from 'vitest'
import { formatIdentityNumber, formatMileage, formatPlate } from './formatters'

describe('formatIdentityNumber', () => {
  it('adds the dashes of the Honduran format', () => {
    expect(formatIdentityNumber('0801199012345')).toBe('0801-1990-12345')
  })

  it('leaves values that are not a stored identity number unchanged', () => {
    expect(formatIdentityNumber('0801-1990-12345')).toBe('0801-1990-12345')
    expect(formatIdentityNumber('123')).toBe('123')
  })
})

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
