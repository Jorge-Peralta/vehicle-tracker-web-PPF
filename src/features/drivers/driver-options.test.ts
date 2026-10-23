import { describe, expect, it } from 'vitest'
import { toDriverOptions } from './driver-options'

describe('toDriverOptions', () => {
  it('labels each driver with name and identity number, so namesakes can be told apart', () => {
    expect(
      toDriverOptions([
        { id: 1, fullName: 'Ana López', identityNumber: '0801199012345' },
        { id: 2, fullName: 'Ana López', identityNumber: '0501198501234' },
      ]),
    ).toEqual([
      { value: 1, label: 'Ana López · 0801-1990-12345' },
      { value: 2, label: 'Ana López · 0501-1985-01234' },
    ])
  })
})
