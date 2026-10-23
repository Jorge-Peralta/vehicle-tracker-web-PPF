import { Car } from '@primeicons/react/car'
import { Pencil } from '@primeicons/react/pencil'
import { Plus } from '@primeicons/react/plus'
import { Search } from '@primeicons/react/search'
import { Trash } from '@primeicons/react/trash'
import { Button } from '@primereact/ui/button'
import { DataTable } from '@primereact/ui/datatable'
import { IconField } from '@primereact/ui/iconfield'
import { InputText } from '@primereact/ui/inputtext'
import { Tag } from '@primereact/ui/tag'
import { toast } from '@primereact/ui/toaster'
import { ToggleSwitch } from '@primereact/ui/toggleswitch'
import { useState } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../../api/client'
import type { Vehicle } from '../../../api/types'
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog'
import { PageHeader } from '../../../components/layout/PageHeader'
import { formatPlate } from '../../../lib/formatters'
import { useDebouncedValue } from '../../../lib/use-debounced-value'
import { useDeleteVehicle, useVehicles } from '../hooks/use-vehicles'
import './VehiclesListPage.scss'

export function VehiclesListPage() {
  const [search, setSearch] = useState('')
  const [includeInactive, setIncludeInactive] = useState(false)
  const debouncedSearch = useDebouncedValue(search.trim())

  const vehiclesQuery = useVehicles({
    search: debouncedSearch || undefined,
    includeInactive,
  })
  const vehicles = vehiclesQuery.data ?? []

  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  const deleteVehicle = useDeleteVehicle()

  const confirmDelete = async () => {
    if (!vehicleToDelete) return
    const label = `${vehicleToDelete.brand} ${vehicleToDelete.model} (${formatPlate(vehicleToDelete.plate)})`
    try {
      const { result } = await deleteVehicle.mutateAsync(vehicleToDelete.id)
      toast.success(
        result === 'deleted'
          ? { title: 'Vehículo eliminado', description: label }
          : {
              title: 'Vehículo desactivado',
              description: `${label} tenía movimientos registrados; se conserva su historial.`,
            },
      )
    } catch (error) {
      toast.error({ title: 'No se pudo eliminar el vehículo', description: getErrorMessage(error) })
    } finally {
      setVehicleToDelete(null)
    }
  }

  const columnCount = includeInactive ? 6 : 5

  return (
    <>
      <PageHeader
        title="Vehículos"
        description="Vehículos registrados"
        actions={
          <Button as={Link} to="/vehicles/new">
            <Plus aria-hidden="true" />
            Nuevo vehículo
          </Button>
        }
      />

      <div className="card">
        <div className="vehicles-toolbar">
          <IconField.Root className="vehicles-toolbar__search">
            <IconField.Inset>
              <Search aria-hidden="true" />
            </IconField.Inset>
            <InputText
              type="search"
              value={search}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por marca, modelo o placa"
              aria-label="Buscar vehículos"
              fluid
            />
          </IconField.Root>

          <div className="vehicles-toolbar__toggle">
            <ToggleSwitch.Root
              inputId="include-inactive"
              checked={includeInactive}
              onCheckedChange={(event: { checked: boolean }) => setIncludeInactive(event.checked)}
            >
              <ToggleSwitch.Control>
                <ToggleSwitch.Handle />
              </ToggleSwitch.Control>
            </ToggleSwitch.Root>
            <label htmlFor="include-inactive">Mostrar eliminados</label>
          </div>
        </div>

        <DataTable.Root data={vehicles} dataKey="id">
          <DataTable.TableContainer>
            <DataTable.Table
              className="vehicles-table responsive-table"
              aria-busy={vehiclesQuery.isFetching}
            >
              <DataTable.THead>
                <DataTable.THeadRow>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Placa</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Marca</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Modelo</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  <DataTable.THeadCell>
                    <DataTable.THeadTitle>Año</DataTable.THeadTitle>
                  </DataTable.THeadCell>
                  {includeInactive && (
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>Estado</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                  )}
                  <DataTable.THeadCell className="vehicles-table__actions">
                    <DataTable.THeadTitle>
                      <span className="visually-hidden">Acciones</span>
                    </DataTable.THeadTitle>
                  </DataTable.THeadCell>
                </DataTable.THeadRow>
              </DataTable.THead>

              <DataTable.TBody>
                {({ item: vehicle }: { item: Vehicle }) => (
                  <DataTable.Row key={vehicle.id}>
                    {/* data-label: column name shown in the card layout on small screens */}
                    <DataTable.Cell data-label="Placa">
                      <span className="vehicles-table__plate">{formatPlate(vehicle.plate)}</span>
                    </DataTable.Cell>
                    <DataTable.Cell data-label="Marca">{vehicle.brand}</DataTable.Cell>
                    <DataTable.Cell data-label="Modelo">{vehicle.model}</DataTable.Cell>
                    <DataTable.Cell data-label="Año">{vehicle.year ?? '—'}</DataTable.Cell>
                    {includeInactive && (
                      <DataTable.Cell data-label="Estado">
                        {vehicle.isActive ? (
                          <Tag severity="success">Activo</Tag>
                        ) : (
                          <Tag severity="secondary">Eliminado</Tag>
                        )}
                      </DataTable.Cell>
                    )}
                    <DataTable.Cell className="vehicles-table__actions responsive-table__actions">
                      {vehicle.isActive && (
                        <div className="vehicles-table__buttons">
                          <Button
                            as={Link}
                            to={`/vehicles/${vehicle.id}/edit`}
                            variant="text"
                            severity="secondary"
                            iconOnly
                            rounded
                            aria-label={`Editar ${formatPlate(vehicle.plate)}`}
                            title="Editar"
                          >
                            <Pencil aria-hidden="true" />
                          </Button>
                          <Button
                            variant="text"
                            severity="danger"
                            iconOnly
                            rounded
                            aria-label={`Eliminar ${formatPlate(vehicle.plate)}`}
                            title="Eliminar"
                            onClick={() => setVehicleToDelete(vehicle)}
                          >
                            <Trash aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable.TBody>

              <DataTable.EmptyTBody>
                <DataTable.Row>
                  <DataTable.Cell colSpan={columnCount}>
                    <VehiclesEmptyState
                      isLoading={vehiclesQuery.isPending}
                      error={vehiclesQuery.error}
                      isSearching={debouncedSearch !== ''}
                      onRetry={() => vehiclesQuery.refetch()}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable.EmptyTBody>
            </DataTable.Table>
          </DataTable.TableContainer>
        </DataTable.Root>
      </div>

      <ConfirmDialog
        open={vehicleToDelete !== null}
        title="Eliminar vehículo"
        message={
          vehicleToDelete && (
            <>
              <p>
                ¿Eliminar{' '}
                <strong>
                  {vehicleToDelete.brand} {vehicleToDelete.model} (
                  {formatPlate(vehicleToDelete.plate)})
                </strong>
                ?
              </p>
              <p>
                Si tiene entradas o salidas registradas, se desactivará y se conservará su
                historial.
              </p>
            </>
          )
        }
        confirmLabel="Eliminar"
        isConfirming={deleteVehicle.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVehicleToDelete(null)}
      />
    </>
  )
}

type VehiclesEmptyStateProps = {
  isLoading: boolean
  error: unknown
  isSearching: boolean
  onRetry: () => void
}

function VehiclesEmptyState({ isLoading, error, isSearching, onRetry }: VehiclesEmptyStateProps) {
  if (isLoading) {
    return <p className="vehicles-empty">Cargando vehículos…</p>
  }

  if (error) {
    return (
      <div className="vehicles-empty" role="alert">
        <p>{getErrorMessage(error)}</p>
        <Button size="small" variant="outlined" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (isSearching) {
    return (
      <div className="vehicles-empty">
        <span className="empty-state__icon">
          <Search aria-hidden="true" />
        </span>
        <p>No hay vehículos que coincidan con la búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="vehicles-empty">
      <span className="empty-state__icon">
        <Car aria-hidden="true" />
      </span>
      <p>Aún no hay vehículos registrados.</p>
      <Button as={Link} to="/vehicles/new" size="small">
        <Plus aria-hidden="true" />
        Registrar el primero
      </Button>
    </div>
  )
}
