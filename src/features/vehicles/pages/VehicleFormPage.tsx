import { Button } from '@primereact/ui/button'
import { Message } from '@primereact/ui/message'
import { toast } from '@primereact/ui/toaster'
import { Link, useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '../../../api/client'
import type { Vehicle } from '../../../api/types'
import { PageHeader } from '../../../components/layout/PageHeader'
import { formatPlate } from '../../../lib/formatters'
import { VehicleForm } from '../components/VehicleForm'
import { useCreateVehicle, useUpdateVehicle, useVehicle } from '../hooks/use-vehicles'
import type { VehicleFormValues } from '../schemas/vehicle-form.schema'

/** `/vehicles/new` and `/vehicles/:id/edit`. */
export function VehicleFormPage() {
  const { id } = useParams()
  const vehicleId = id === undefined ? undefined : Number(id)

  if (vehicleId === undefined) return <CreateVehicle />
  if (!Number.isInteger(vehicleId) || vehicleId <= 0) return <VehicleNotAvailable />
  return <EditVehicle vehicleId={vehicleId} />
}

function useShowErrorToast() {
  return (error: unknown) =>
    toast.error({ title: 'No se pudo guardar el vehículo', description: getErrorMessage(error) })
}

function CreateVehicle() {
  const navigate = useNavigate()
  const createVehicle = useCreateVehicle()
  const showErrorToast = useShowErrorToast()

  const handleSubmit = async (values: VehicleFormValues) => {
    const vehicle = await createVehicle.mutateAsync(values)
    toast.success({
      title: 'Vehículo guardado',
      description: `${vehicle.brand} ${vehicle.model} (${formatPlate(vehicle.plate)})`,
    })
    navigate('/vehicles')
  }

  return (
    <>
      <PageHeader
        title="Nuevo vehículo"
        description="Registre un vehículo para controlar sus movimientos"
      />
      <VehicleForm
        submitLabel="Guardar vehículo"
        onSubmit={handleSubmit}
        onUnhandledError={showErrorToast}
      />
    </>
  )
}

function EditVehicle({ vehicleId }: { vehicleId: number }) {
  const navigate = useNavigate()
  const vehicleQuery = useVehicle(vehicleId)
  const updateVehicle = useUpdateVehicle(vehicleId)
  const showErrorToast = useShowErrorToast()

  if (vehicleQuery.isPending) {
    return (
      <>
        <PageHeader title="Editar vehículo" />
        <div className="card" aria-busy="true">
          Cargando vehículo…
        </div>
      </>
    )
  }

  if (vehicleQuery.isError) {
    return <VehicleNotAvailable message={getErrorMessage(vehicleQuery.error)} />
  }

  const vehicle = vehicleQuery.data
  if (!vehicle.isActive) {
    return <VehicleNotAvailable message="Este vehículo fue eliminado y ya no se puede editar." />
  }

  const handleSubmit = async (values: VehicleFormValues) => {
    const updated: Vehicle = await updateVehicle.mutateAsync(values)
    toast.success({
      title: 'Cambios guardados',
      description: `${updated.brand} ${updated.model} (${formatPlate(updated.plate)})`,
    })
    navigate('/vehicles')
  }

  return (
    <>
      <PageHeader title="Editar vehículo" description={formatPlate(vehicle.plate)} />
      <VehicleForm
        // Re-mount when the loaded vehicle changes so the form picks up its values.
        key={vehicle.id}
        defaultValues={{
          brand: vehicle.brand,
          model: vehicle.model,
          plate: formatPlate(vehicle.plate),
          year: vehicle.year,
        }}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onUnhandledError={showErrorToast}
      />
    </>
  )
}

function VehicleNotAvailable({ message = 'No se encontró el vehículo.' }: { message?: string }) {
  return (
    <>
      <PageHeader title="Editar vehículo" />
      <div className="card">
        <Message.Root severity="warn">
          <Message.Content>
            <Message.Text>{message}</Message.Text>
          </Message.Content>
        </Message.Root>
        <div className="form-actions">
          <Button as={Link} to="/vehicles">
            Volver a vehículos
          </Button>
        </div>
      </div>
    </>
  )
}
