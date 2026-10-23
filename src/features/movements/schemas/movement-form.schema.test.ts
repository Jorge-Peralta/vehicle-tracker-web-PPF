import { describe, expect, it } from 'vitest'
import {
  createMovementFormSchema,
  type LastMovement,
  type MovementFormInput,
} from './movement-form.schema'

const HOUR_IN_MS = 60 * 60 * 1000
const hoursAgo = (hours: number) => new Date(Date.now() - hours * HOUR_IN_MS)

const validMovement: MovementFormInput = {
  vehicleId: 1,
  type: 'ENTRY',
  driverName: 'Ana López',
  occurredAt: hoursAgo(1),
  mileage: 1500,
}

function validate(values: Partial<MovementFormInput>, lastMovement: LastMovement | null = null) {
  return createMovementFormSchema(lastMovement).safeParse({ ...validMovement, ...values })
}

function errorsFor(values: Partial<MovementFormInput>, lastMovement: LastMovement | null = null) {
  const result = validate(values, lastMovement)
  if (result.success) return {}
  // The form shows the first message of each field, so keep the first one.
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message
  return errors
}

describe('createMovementFormSchema', () => {
  it('accepts a valid movement and cleans up the driver name', () => {
    const result = validate({ driverName: '  Ana   López ' })
    expect(result.success && result.data.driverName).toBe('Ana López')
  })

  it('requires vehicle, driver, date, and mileage', () => {
    expect(errorsFor({ vehicleId: null, driverName: '', occurredAt: null, mileage: null })).toEqual(
      {
        vehicleId: 'El vehículo es obligatorio',
        driverName: 'El nombre del conductor es obligatorio',
        occurredAt: 'La fecha es obligatoria',
        mileage: 'El kilometraje es obligatorio',
      },
    )
  })

  it('rejects driver names with digits or symbols', () => {
    expect(errorsFor({ driverName: 'Ana 2' })).toEqual({
      driverName:
        "El nombre del conductor solo puede contener letras, espacios y los caracteres . ' -",
    })
  })

  it('rejects dates in the future', () => {
    expect(errorsFor({ occurredAt: new Date(Date.now() + HOUR_IN_MS) })).toEqual({
      occurredAt: 'La fecha no puede estar en el futuro',
    })
  })

  it('rejects negative mileage', () => {
    expect(errorsFor({ mileage: -1 })).toEqual({ mileage: 'El kilometraje no puede ser negativo' })
  })

  describe('with the vehicle last movement', () => {
    const lastMovement: LastMovement = {
      occurredAt: new Date('2026-03-10T14:30:00.000Z'),
      mileage: 15230,
    }

    it('requires a date after the last movement, shown in Honduras time', () => {
      expect(
        errorsFor({ occurredAt: lastMovement.occurredAt, mileage: 16000 }, lastMovement),
      ).toEqual({
        occurredAt:
          'La fecha debe ser posterior al último movimiento del vehículo (10/03/2026, 08:30)',
      })
    })

    it('rejects mileage lower than the last one and accepts the same mileage', () => {
      expect(errorsFor({ mileage: 15229 }, lastMovement)).toEqual({
        mileage:
          'El kilometraje no puede ser menor que el último registrado para el vehículo (15,230 km)',
      })
      expect(errorsFor({ mileage: 15230 }, lastMovement)).toEqual({})
    })
  })
})
