import { describe, expect, it } from 'vitest'
import { vehicleFormSchema, type VehicleFormValues } from './vehicle-form.schema'

const validVehicle: VehicleFormValues = {
  brand: 'Toyota',
  model: 'Hilux',
  plate: 'HAA 1234',
  year: 2021,
}

/** First error message per field, like the form shows them. */
function errorsFor(values: Partial<VehicleFormValues>) {
  const result = vehicleFormSchema.safeParse({ ...validVehicle, ...values })
  if (result.success) return {}
  // The form shows the first message of each field, so keep the first one.
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message
  return errors
}

describe('vehicleFormSchema', () => {
  it('accepts a valid vehicle, with or without year', () => {
    expect(errorsFor({})).toEqual({})
    expect(errorsFor({ year: null })).toEqual({})
  })

  it('accepts plates with or without the space, in any case (the API normalizes them)', () => {
    expect(errorsFor({ plate: 'HAA1234' })).toEqual({})
    expect(errorsFor({ plate: 'haa 1234' })).toEqual({})
  })

  it('requires brand, model, and plate with the API messages', () => {
    expect(errorsFor({ brand: '  ', model: '', plate: '' })).toEqual({
      brand: 'La marca es obligatoria',
      model: 'El modelo es obligatorio',
      plate: 'La placa es obligatoria',
    })
  })

  it('rejects plates that are not 3 letters and 4 digits', () => {
    for (const plate of ['AB 1234', 'HAA 123', 'HAA-1234', '1234 HAA']) {
      expect(errorsFor({ plate })).toEqual({
        plate: 'La placa debe tener 3 letras y 4 dígitos, por ejemplo HAA 1234',
      })
    }
  })

  it('limits brand and model to 50 characters', () => {
    expect(errorsFor({ brand: 'x'.repeat(51) })).toEqual({
      brand: 'La marca debe tener como máximo 50 caracteres',
    })
  })

  it('accepts years from 1900 to next year only', () => {
    const nextYear = new Date().getFullYear() + 1
    expect(errorsFor({ year: 1900 })).toEqual({})
    expect(errorsFor({ year: nextYear })).toEqual({})
    expect(errorsFor({ year: 1899 })).toEqual({ year: 'El año debe ser 1900 o posterior' })
    expect(errorsFor({ year: nextYear + 1 })).toEqual({
      year: 'El año no puede ser posterior al próximo año',
    })
    expect(errorsFor({ year: 2020.5 })).toEqual({ year: 'El año debe ser un número entero' })
  })
})
