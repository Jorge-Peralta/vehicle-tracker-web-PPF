import { FilterSlash } from '@primeicons/react/filter-slash'
import { Plus } from '@primeicons/react/plus'
import { Button } from '@primereact/ui/button'
import { DataTable } from '@primereact/ui/datatable'
import { Tag } from '@primereact/ui/tag'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../../api/client'
import type { Movement, MovementType } from '../../../api/types'
import { TablePagination } from '../../../components/data/TablePagination'
import { DateRangeInput } from '../../../components/form/DatePickerInputs'
import { SelectInput } from '../../../components/form/SelectInput'
import { PageHeader } from '../../../components/layout/PageHeader'
import { formatDateTime, parseDateParam, toDateParam } from '../../../lib/dates'
import { formatMileage, formatPlate } from '../../../lib/formatters'
import { useDrivers } from '../../drivers/drivers-api'
import { useVehicles } from '../../vehicles/hooks/use-vehicles'
import { PAGE_SIZE_OPTIONS, useMovementFilters } from '../hooks/use-movement-filters'
import { useMovements } from '../hooks/use-movements'
import { movementTypeLabels, movementTypeOptions } from '../movement-labels'
import './MovementsListPage.scss'

const COLUMN_COUNT = 5

export function MovementsListPage() {
  const { filters, apiParams, updateFilters, clearFilters, hasActiveFilters } = useMovementFilters()
  const movementsQuery = useMovements(apiParams)
  const movements = movementsQuery.data?.data ?? []

  // Deleted vehicles still have history, so they're offered as filters too.
  const vehiclesQuery = useVehicles({ includeInactive: true })
  const vehicleOptions = useMemo(
    () =>
      (vehiclesQuery.data ?? []).map((vehicle) => ({
        value: vehicle.id,
        label: `${formatPlate(vehicle.plate)} · ${vehicle.brand} ${vehicle.model}${vehicle.isActive ? '' : ' (eliminado)'}`,
      })),
    [vehiclesQuery.data],
  )

  const driversQuery = useDrivers()
  const driverOptions = useMemo(
    () => (driversQuery.data ?? []).map((driver) => ({ value: driver.id, label: driver.fullName })),
    [driversQuery.data],
  )

  return (
    <>
      <PageHeader
        title="Entradas y salidas"
        description="Historial de movimientos de los vehículos"
        actions={
          <Button as={Link} to="/movements/new">
            <Plus aria-hidden="true" />
            Registrar movimiento
          </Button>
        }
      />

      <div className="card">
        <div className="movement-filters" role="search" aria-label="Filtros de movimientos">
          <DateRangeInput
            inputId="filter-dates"
            ariaLabel="Rango de fechas"
            value={{ from: parseDateParam(filters.from), to: parseDateParam(filters.to) }}
            onChange={({ from, to }) =>
              updateFilters({
                from: from ? toDateParam(from) : undefined,
                to: to ? toDateParam(to) : undefined,
              })
            }
          />
          <SelectInput
            inputId="filter-vehicle"
            ariaLabel="Vehículo"
            options={vehicleOptions}
            value={filters.vehicleId ?? null}
            onChange={(vehicleId) => updateFilters({ vehicleId: vehicleId ?? undefined })}
            placeholder="Todos los vehículos"
            searchable
            clearable
          />
          <SelectInput
            inputId="filter-driver"
            ariaLabel="Conductor"
            options={driverOptions}
            value={filters.driverId ?? null}
            onChange={(driverId) => updateFilters({ driverId: driverId ?? undefined })}
            placeholder="Todos los conductores"
            searchable
            clearable
          />
          <SelectInput<MovementType>
            inputId="filter-type"
            ariaLabel="Tipo de movimiento"
            options={movementTypeOptions}
            value={filters.type ?? null}
            onChange={(type) => updateFilters({ type: type ?? undefined })}
            placeholder="Entradas y salidas"
            clearable
          />
          <Button
            variant="text"
            severity="secondary"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            <FilterSlash aria-hidden="true" />
            Limpiar filtros
          </Button>
        </div>

        <DataTable.Root data={movements} dataKey="id">
          <DataTable.TableContainer>
            <DataTable.Table
              className="movements-table responsive-table"
              aria-busy={movementsQuery.isFetching}
            >
              <DataTable.THead>
                <DataTable.THeadRow>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Fecha y hora</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Tipo</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Vehículo</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Conductor</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell className="movements-table__number">
                    <DataTable.THeadTitle>Kilometraje</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                </DataTable.THeadRow>
              </DataTable.THead>

              <DataTable.TBody>
                {({ item: movement }: { item: Movement }) => (
                  <DataTable.Row key={movement.id}>
                    <DataTable.Cell className="movements-table__date" data-label="Fecha y hora">
                      {formatDateTime(movement.occurredAt)}
                    </DataTable.Cell>
                    <DataTable.Cell data-label="Tipo">
                      <Tag severity={movement.type === 'ENTRY' ? 'success' : 'warn'}>
                        {movementTypeLabels[movement.type]}
                      </Tag>
                    </DataTable.Cell>
                    <DataTable.Cell data-label="Vehículo">
                      {/* One wrapper so plate and model stay together in the card layout. */}
                      <div>
                        <span className="movements-table__plate">
                          {formatPlate(movement.vehicle.plate)}
                        </span>
                        <span className="movements-table__muted">
                          {movement.vehicle.brand} {movement.vehicle.model}
                        </span>
                      </div>
                    </DataTable.Cell>
                    <DataTable.Cell data-label="Conductor">
                      {movement.driver.fullName}
                    </DataTable.Cell>
                    <DataTable.Cell className="movements-table__number" data-label="Kilometraje">
                      {formatMileage(movement.mileage)}
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable.TBody>

              <DataTable.EmptyTBody>
                <DataTable.Row>
                  <DataTable.Cell colSpan={COLUMN_COUNT}>
                    <MovementsEmptyState
                      isLoading={movementsQuery.isPending}
                      error={movementsQuery.error}
                      hasActiveFilters={hasActiveFilters}
                      onRetry={() => movementsQuery.refetch()}
                      onClearFilters={clearFilters}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable.EmptyTBody>
            </DataTable.Table>
          </DataTable.TableContainer>
        </DataTable.Root>

        {movementsQuery.data && movementsQuery.data.total > 0 && (
          <TablePagination
            page={filters.page}
            pageSize={filters.pageSize}
            total={movementsQuery.data.total}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={(page) => updateFilters({ page })}
            onPageSizeChange={(pageSize) => updateFilters({ pageSize })}
          />
        )}
      </div>
    </>
  )
}

type MovementsEmptyStateProps = {
  isLoading: boolean
  error: unknown
  hasActiveFilters: boolean
  onRetry: () => void
  onClearFilters: () => void
}

function MovementsEmptyState({
  isLoading,
  error,
  hasActiveFilters,
  onRetry,
  onClearFilters,
}: MovementsEmptyStateProps) {
  if (isLoading) {
    return <p className="movements-empty">Cargando movimientos…</p>
  }

  if (error) {
    return (
      <div className="movements-empty" role="alert">
        <p>{getErrorMessage(error)}</p>
        <Button size="small" variant="outlined" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (hasActiveFilters) {
    return (
      <div className="movements-empty">
        <p>No hay movimientos con los filtros seleccionados.</p>
        <Button size="small" variant="outlined" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </div>
    )
  }

  return (
    <div className="movements-empty">
      <p>Aún no hay entradas ni salidas registradas.</p>
      <Button as={Link} to="/movements/new" size="small">
        <Plus aria-hidden="true" />
        Registrar el primero
      </Button>
    </div>
  )
}
