import { describe, expect, it } from 'vitest'
import { nextMovementType } from './movement-labels'

describe('nextMovementType', () => {
  it('suggests an exit for a vehicle that is inside', () => {
    expect(nextMovementType('INSIDE')).toBe('EXIT')
  })

  it('suggests an entry for a vehicle that is outside', () => {
    expect(nextMovementType('OUTSIDE')).toBe('ENTRY')
  })

  it('suggests an entry for a vehicle without movements', () => {
    expect(nextMovementType(null)).toBe('ENTRY')
  })
})
