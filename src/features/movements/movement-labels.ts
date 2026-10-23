import type { MovementType, VehicleDetail } from '../../api/types'

export const movementTypeLabels: Record<MovementType, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
}

/** Tag colors; they match the entry/exit colors of the dashboard chart. */
export const movementTypeSeverity: Record<MovementType, 'info' | 'warn'> = {
  ENTRY: 'info',
  EXIT: 'warn',
}

export const movementTypeOptions = (Object.keys(movementTypeLabels) as MovementType[]).map(
  (type) => ({ value: type, label: movementTypeLabels[type] }),
)

export const vehicleStatusLabels: Record<NonNullable<VehicleDetail['currentStatus']>, string> = {
  INSIDE: 'Dentro',
  OUTSIDE: 'Fuera',
}

/** The movement that keeps types alternating: a vehicle inside can only exit, and vice versa. */
export function nextMovementType(status: VehicleDetail['currentStatus']): MovementType {
  return status === 'INSIDE' ? 'EXIT' : 'ENTRY'
}
