import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@primereact/ui/button'
import { InputNumber } from '@primereact/ui/inputnumber'
import { Message } from '@primereact/ui/message'
import { toast } from '@primereact/ui/toaster'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ApiError, getErrorMessage } from '../../../api/client'
import { DateTimeInput } from '../../../components/form/DatePickerInputs'
import { fieldDescriptionId } from '../../../components/form/field-ids'
import { FormField } from '../../../components/form/FormField'
import { SelectInput } from '../../../components/form/SelectInput'
import { PageHeader } from '../../../components/layout/PageHeader'
import { nowToTheMinute } from '../../../lib/dates'
import { applyApiFieldErrors } from '../../../lib/form-errors'
import { formatPlate } from '../../../lib/formatters'
import { toDriverOptions } from '../../drivers/driver-options'
import { useDrivers } from '../../drivers/drivers-api'
import { useVehicle, useVehicles } from '../../vehicles/hooks/use-vehicles'
import { MovementTypeInput } from '../components/MovementTypeInput'
import { VehicleStatusSummary } from '../components/VehicleStatusSummary'
import { useRegisterMovement } from '../hooks/use-movements'
import { movementTypeLabels, nextMovementType } from '../movement-labels'
import {
  createMovementFormSchema,
  type LastMovement,
  type MovementFormInput,
  type MovementFormValues,
} from '../schemas/movement-form.schema'
import './MovementFormPage.scss'

const FIELD_NAMES = ['vehicleId', 'type', 'driverId', 'occurredAt', 'mileage'] as const

/** `/movements/new`; `?vehicleId=` preselects a vehicle. */
export function MovementFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedVehicleId = Number(searchParams.get('vehicleId')) || null

  const vehiclesQuery = useVehicles()
  const vehicleOptions = useMemo(
    () =>
      (vehiclesQuery.data ?? []).map((vehicle) => ({
        value: vehicle.id,
        label: `${formatPlate(vehicle.plate)} · ${vehicle.brand} ${vehicle.model}`,
      })),
    [vehiclesQuery.data],
  )

  const driversQuery = useDrivers()
  const driverOptions = useMemo(() => toDriverOptions(driversQuery.data ?? []), [driversQuery.data])

  // The date and mileage rules depend on the selected vehicle, which is only known after the
  // form exists, so the resolver reads the latest value from a ref.
  const lastMovementRef = useRef<LastMovement | null>(null)
  const resolver = useCallback<Resolver<MovementFormInput, unknown, MovementFormValues>>(
    (values, context, options) =>
      zodResolver(createMovementFormSchema(lastMovementRef.current))(values, context, options),
    [],
  )

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting },
  } = useForm<MovementFormInput, unknown, MovementFormValues>({
    resolver,
    mode: 'onTouched',
    defaultValues: {
      vehicleId: preselectedVehicleId,
      type: 'ENTRY',
      driverId: null,
      occurredAt: nowToTheMinute(),
      mileage: null,
    },
  })

  const vehicleId = useWatch({ control, name: 'vehicleId' })
  const vehicleQuery = useVehicle(vehicleId ?? undefined)
  const vehicle = vehicleId !== null ? vehicleQuery.data : undefined

  const lastMovement = useMemo<LastMovement | null>(
    () =>
      vehicle?.lastMovementAt != null && vehicle.lastMileage !== null
        ? { occurredAt: new Date(vehicle.lastMovementAt), mileage: vehicle.lastMileage }
        : null,
    [vehicle],
  )

  // When the selected vehicle loads: suggest the next type and start from its last mileage.
  useEffect(() => {
    lastMovementRef.current = lastMovement
    if (!vehicle) return
    setValue('type', nextMovementType(vehicle.currentStatus))
    setValue('mileage', vehicle.lastMileage)
  }, [vehicle, lastMovement, setValue])

  // Fixed when the page opens; the "not in the future" rule is checked on submit anyway.
  const [endOfToday] = useState(() => {
    const date = new Date()
    date.setHours(23, 59, 59, 999)
    return date
  })

  const registerMovement = useRegisterMovement()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      const movement = await registerMovement.mutateAsync({
        vehicleId: values.vehicleId!,
        type: values.type,
        driverId: values.driverId!,
        occurredAt: values.occurredAt!.toISOString(),
        mileage: values.mileage!,
      })
      toast.success({
        title: `${movementTypeLabels[movement.type]} registrada`,
        description: `${formatPlate(movement.vehicle.plate)} · ${movement.driver.fullName}`,
      })
      navigate('/movements')
    } catch (error) {
      if (applyApiFieldErrors(error, setError, FIELD_NAMES)) return
      // 404/409: the vehicle was deleted or another movement was registered meanwhile.
      if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
        setSubmitError(error.message)
        void vehicleQuery.refetch()
        return
      }
      toast.error({
        title: 'No se pudo registrar el movimiento',
        description: getErrorMessage(error),
      })
    }
  })

  return (
    <>
      <PageHeader title="Registrar movimiento" description="Entrada o salida de un vehículo" />

      <form className="card" onSubmit={submit} noValidate>
        <div className="form-grid">
          <Controller
            name="vehicleId"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId="vehicleId"
                label="Vehículo"
                required
                error={fieldState.error?.message}
              >
                <SelectInput
                  inputId="vehicleId"
                  options={vehicleOptions}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    setSubmitError(null)
                  }}
                  placeholder={
                    vehiclesQuery.isPending ? 'Cargando vehículos…' : 'Seleccione un vehículo'
                  }
                  searchable
                  emptyMessage="No hay vehículos"
                  invalid={fieldState.invalid}
                />
              </FormField>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <FormField inputId="type" label="Tipo" required error={fieldState.error?.message}>
                <MovementTypeInput
                  name="type"
                  value={field.value}
                  onChange={field.onChange}
                  suggested={vehicle ? nextMovementType(vehicle.currentStatus) : undefined}
                  invalid={fieldState.invalid}
                  describedBy={fieldDescriptionId('type')}
                />
              </FormField>
            )}
          />

          {vehicle && (
            <div className="movement-form__status">
              <VehicleStatusSummary vehicle={vehicle} />
            </div>
          )}

          <Controller
            name="driverId"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId="driverId"
                label="Conductor"
                required
                error={fieldState.error?.message}
              >
                <SelectInput
                  inputId="driverId"
                  options={driverOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    driversQuery.isPending ? 'Cargando conductores…' : 'Seleccione un conductor'
                  }
                  emptyMessage="No hay conductores registrados"
                  searchable
                  invalid={fieldState.invalid}
                />
              </FormField>
            )}
          />

          <Controller
            name="occurredAt"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId="occurredAt"
                label="Fecha y hora"
                required
                error={fieldState.error?.message}
              >
                <DateTimeInput
                  inputId="occurredAt"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  minDate={lastMovement?.occurredAt}
                  maxDate={endOfToday}
                  invalid={fieldState.invalid}
                />
              </FormField>
            )}
          />

          <Controller
            name="mileage"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId="mileage"
                label="Kilometraje"
                required
                error={fieldState.error?.message}
                hint={
                  lastMovement
                    ? `Mínimo: el último registrado (${lastMovement.mileage.toLocaleString('es-HN')} km)`
                    : 'Lectura del odómetro en km'
                }
              >
                <InputNumber.Root
                  value={field.value}
                  onValueChange={(event: { value: number | null | undefined }) =>
                    field.onChange(event.value ?? null)
                  }
                  min={0}
                  max={9_999_999}
                  suffix=" km"
                  locale="es-HN"
                  invalid={fieldState.invalid}
                  fluid
                >
                  <InputNumber.Input
                    id="mileage"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    placeholder="Ej.: 15,230 km"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldDescriptionId('mileage')}
                  />
                </InputNumber.Root>
              </FormField>
            )}
          />
        </div>

        {submitError && (
          <Message.Root severity="error" className="movement-form__error" role="alert">
            <Message.Content>
              <Message.Text>{submitError}</Message.Text>
            </Message.Content>
          </Message.Root>
        )}

        <div className="form-actions">
          <Button as={Link} to="/movements" severity="secondary" variant="text">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Registrar movimiento'}
          </Button>
        </div>
      </form>
    </>
  )
}
