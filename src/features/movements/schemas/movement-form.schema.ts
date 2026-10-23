import { z } from 'zod'
import { formatDateTime } from '../../../lib/dates'
import { formatMileage } from '../../../lib/formatters'

/** Allowed difference between the browser clock and "now" when checking future dates. */
const CLOCK_SKEW_MS = 60 * 1000

const DRIVER_NAME_PATTERN = /^\p{L}[\p{L}\s.'-]*$/u

/** The selected vehicle's last movement, used for the date and mileage rules. */
export type LastMovement = { occurredAt: Date; mileage: number }

/**
 * Client-side copy of the API's movement rules (vehicle-tracker-api, movement.schemas.ts and
 * movement.service.ts), with the same Spanish messages. The API checks them again.
 */
export function createMovementFormSchema(lastMovement: LastMovement | null) {
  return z
    .object({
      vehicleId: z.number('El vehículo es obligatorio').nullable(),
      type: z.enum(['ENTRY', 'EXIT'], 'El tipo debe ser entrada o salida'),
      driverName: z
        .string()
        .transform((name) => name.trim().replace(/\s+/g, ' '))
        .pipe(
          z
            .string()
            .min(1, 'El nombre del conductor es obligatorio')
            .min(2, 'El nombre del conductor debe tener al menos 2 caracteres')
            .max(100, 'El nombre del conductor debe tener como máximo 100 caracteres')
            .regex(
              DRIVER_NAME_PATTERN,
              "El nombre del conductor solo puede contener letras, espacios y los caracteres . ' -",
            ),
        ),
      occurredAt: z.date('La fecha es obligatoria').nullable(),
      mileage: z
        .number('El kilometraje es obligatorio')
        .int('El kilometraje debe ser un número entero')
        .min(0, 'El kilometraje no puede ser negativo')
        .max(9_999_999, 'El kilometraje debe ser como máximo 9,999,999')
        .nullable(),
    })
    .superRefine((values, context) => {
      if (values.vehicleId === null) {
        context.addIssue({
          code: 'custom',
          path: ['vehicleId'],
          message: 'El vehículo es obligatorio',
        })
      }

      if (values.occurredAt === null) {
        context.addIssue({
          code: 'custom',
          path: ['occurredAt'],
          message: 'La fecha es obligatoria',
        })
      } else if (values.occurredAt.getTime() > Date.now() + CLOCK_SKEW_MS) {
        context.addIssue({
          code: 'custom',
          path: ['occurredAt'],
          message: 'La fecha no puede estar en el futuro',
        })
      } else if (lastMovement && values.occurredAt <= lastMovement.occurredAt) {
        context.addIssue({
          code: 'custom',
          path: ['occurredAt'],
          message: `La fecha debe ser posterior al último movimiento del vehículo (${formatDateTime(lastMovement.occurredAt)})`,
        })
      }

      if (values.mileage === null) {
        context.addIssue({
          code: 'custom',
          path: ['mileage'],
          message: 'El kilometraje es obligatorio',
        })
      } else if (lastMovement && values.mileage < lastMovement.mileage) {
        context.addIssue({
          code: 'custom',
          path: ['mileage'],
          message: `El kilometraje no puede ser menor que el último registrado para el vehículo (${formatMileage(lastMovement.mileage)})`,
        })
      }
    })
}

export type MovementFormInput = z.input<ReturnType<typeof createMovementFormSchema>>
export type MovementFormValues = z.output<ReturnType<typeof createMovementFormSchema>>
