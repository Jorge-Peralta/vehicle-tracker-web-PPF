import { z } from 'zod'
import { formatDateTime } from '../../../lib/dates'
import { formatMileage } from '../../../lib/formatters'

/** Allowed difference between the browser clock and "now" when checking future dates. */
const CLOCK_SKEW_MS = 60 * 1000

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
      // Chosen from the existing drivers; the page sends that driver's name to the API.
      driverId: z.number('El conductor es obligatorio').nullable(),
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

      if (values.driverId === null) {
        context.addIssue({
          code: 'custom',
          path: ['driverId'],
          message: 'El conductor es obligatorio',
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
