import { z } from 'zod'

/**
 * Client-side copy of the API's vehicle rules (vehicle-tracker-api, vehicle.schemas.ts),
 * with the same Spanish messages. The API validates again; this only gives instant feedback.
 */
export const PLATE_PATTERN = /^[A-Z]{3}\s?\d{4}$/

const MIN_VEHICLE_YEAR = 1900
const maxVehicleYear = () => new Date().getFullYear() + 1

const requiredText = (requiredMessage: string, tooLongMessage: string) =>
  z.string().trim().min(1, requiredMessage).max(50, tooLongMessage)

export const vehicleFormSchema = z.object({
  brand: requiredText('La marca es obligatoria', 'La marca debe tener como máximo 50 caracteres'),
  model: requiredText('El modelo es obligatorio', 'El modelo debe tener como máximo 50 caracteres'),
  plate: z
    .string()
    .trim()
    .min(1, 'La placa es obligatoria')
    .refine(
      (plate) => PLATE_PATTERN.test(plate.toUpperCase()),
      'La placa debe tener 3 letras y 4 dígitos, por ejemplo HAA 1234',
    ),
  year: z
    .number('El año debe ser un número')
    .int('El año debe ser un número entero')
    .min(MIN_VEHICLE_YEAR, `El año debe ser ${MIN_VEHICLE_YEAR} o posterior`)
    .refine((year) => year <= maxVehicleYear(), 'El año no puede ser posterior al próximo año')
    .nullable(),
})

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>

export const emptyVehicleForm: VehicleFormValues = { brand: '', model: '', plate: '', year: null }
