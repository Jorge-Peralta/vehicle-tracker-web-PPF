import { Tag } from '@primereact/ui/tag'
import type { VehicleDetail } from '../../../api/types'
import { formatDateTime } from '../../../lib/dates'
import { formatMileage } from '../../../lib/formatters'
import { vehicleStatusLabels } from '../movement-labels'
import './VehicleStatusSummary.scss'

/** Where the selected vehicle is now and its last recorded mileage. */
export function VehicleStatusSummary({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <dl className="vehicle-status" aria-live="polite">
      <div>
        <dt>Estado actual</dt>
        <dd>
          {vehicle.currentStatus ? (
            <Tag severity={vehicle.currentStatus === 'INSIDE' ? 'success' : 'warn'}>
              {vehicleStatusLabels[vehicle.currentStatus]}
            </Tag>
          ) : (
            'Sin movimientos'
          )}
        </dd>
      </div>
      <div>
        <dt>Último kilometraje</dt>
        <dd>{vehicle.lastMileage === null ? '—' : formatMileage(vehicle.lastMileage)}</dd>
      </div>
      <div>
        <dt>Último movimiento</dt>
        <dd>{vehicle.lastMovementAt ? formatDateTime(vehicle.lastMovementAt) : '—'}</dd>
      </div>
    </dl>
  )
}
