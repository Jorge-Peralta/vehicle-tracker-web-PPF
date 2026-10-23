import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@primereact/ui/button'
import { InputNumber } from '@primereact/ui/inputnumber'
import { InputText } from '@primereact/ui/inputtext'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { ApiError } from '../../../api/client'
import { fieldDescriptionId } from '../../../components/form/field-ids'
import { FormField } from '../../../components/form/FormField'
import { applyApiFieldErrors } from '../../../lib/form-errors'
import {
  emptyVehicleForm,
  vehicleFormSchema,
  type VehicleFormValues,
} from '../schemas/vehicle-form.schema'

const FIELD_NAMES = ['brand', 'model', 'plate', 'year'] as const

type VehicleFormProps = {
  defaultValues?: VehicleFormValues
  submitLabel: string
  /** Saves the vehicle; a rejected promise with an ApiError is shown on the form. */
  onSubmit: (values: VehicleFormValues) => Promise<unknown>
  /** Called for errors the form can't show next to a field. */
  onUnhandledError: (error: unknown) => void
}

/** Create/edit vehicle form, validated in the browser with the same rules as the API. */
export function VehicleForm({
  defaultValues = emptyVehicleForm,
  submitLabel,
  onSubmit,
  onUnhandledError,
}: VehicleFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      if (applyApiFieldErrors(error, setError, FIELD_NAMES)) return
      // 409: the plate already belongs to another active vehicle.
      if (error instanceof ApiError && error.status === 409) {
        setError('plate', { type: 'server', message: error.message })
        return
      }
      onUnhandledError(error)
    }
  })

  return (
    <form className="card" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Controller
          name="brand"
          control={control}
          render={({ field, fieldState }) => (
            <FormField inputId="brand" label="Marca" required error={fieldState.error?.message}>
              <InputText
                id="brand"
                {...field}
                placeholder="Ej.: Toyota"
                autoComplete="off"
                invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldDescriptionId('brand')}
                fluid
              />
            </FormField>
          )}
        />

        <Controller
          name="model"
          control={control}
          render={({ field, fieldState }) => (
            <FormField inputId="model" label="Modelo" required error={fieldState.error?.message}>
              <InputText
                id="model"
                {...field}
                placeholder="Ej.: Hilux"
                autoComplete="off"
                invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldDescriptionId('model')}
                fluid
              />
            </FormField>
          )}
        />

        <Controller
          name="plate"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId="plate"
              label="Placa"
              required
              error={fieldState.error?.message}
              hint="3 letras y 4 dígitos, por ejemplo HAA 1234"
            >
              <InputText
                id="plate"
                {...field}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(event.target.value.toUpperCase())
                }
                placeholder="Ej.: HAA 1234"
                autoComplete="off"
                maxLength={8}
                invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldDescriptionId('plate')}
                fluid
              />
            </FormField>
          )}
        />

        <Controller
          name="year"
          control={control}
          render={({ field, fieldState }) => (
            <FormField inputId="year" label="Año" error={fieldState.error?.message} hint="Opcional">
              <InputNumber.Root
                value={field.value}
                onValueChange={(event: { value: number | null | undefined }) =>
                  field.onChange(event.value ?? null)
                }
                useGrouping={false}
                invalid={fieldState.invalid}
                fluid
              >
                <InputNumber.Input
                  id="year"
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  placeholder="Ej.: 2021"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldDescriptionId('year')}
                />
              </InputNumber.Root>
            </FormField>
          )}
        />
      </div>

      <div className="form-actions">
        <Button as={Link} to="/vehicles" severity="secondary" variant="text">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
