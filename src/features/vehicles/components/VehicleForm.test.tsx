import { PrimeReactProvider } from '@primereact/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../api/client'
import { VehicleForm } from './VehicleForm'

function renderForm(onSubmit = vi.fn().mockResolvedValue(undefined), onUnhandledError = vi.fn()) {
  render(
    <PrimeReactProvider>
      <MemoryRouter>
        <VehicleForm
          submitLabel="Guardar vehículo"
          onSubmit={onSubmit}
          onUnhandledError={onUnhandledError}
        />
      </MemoryRouter>
    </PrimeReactProvider>,
  )
  return { onSubmit, onUnhandledError, user: userEvent.setup() }
}

async function fillValidVehicle(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Marca/), 'Toyota')
  await user.type(screen.getByLabelText(/Modelo/), 'Hilux')
  await user.type(screen.getByLabelText(/Placa/), 'haa 1234')
}

describe('VehicleForm', () => {
  it('shows required errors and does not submit an empty form', async () => {
    const { onSubmit, user } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Guardar vehículo' }))

    expect(await screen.findByText('La marca es obligatoria')).toBeInTheDocument()
    expect(screen.getByText('El modelo es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La placa es obligatoria')).toBeInTheDocument()
    expect(screen.getByLabelText(/Marca/)).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('uppercases the plate while typing and submits the values', async () => {
    const { onSubmit, user } = renderForm()

    await fillValidVehicle(user)
    expect(screen.getByLabelText(/Placa/)).toHaveValue('HAA 1234')

    await user.click(screen.getByRole('button', { name: 'Guardar vehículo' }))

    expect(onSubmit).toHaveBeenCalledWith({
      brand: 'Toyota',
      model: 'Hilux',
      plate: 'HAA 1234',
      year: null,
    })
  })

  it('shows a duplicate-plate conflict from the API under the plate field', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError('Ya existe un vehículo con la placa HAA 1234', 409))
    const { onUnhandledError, user } = renderForm(onSubmit)

    await fillValidVehicle(user)
    await user.click(screen.getByRole('button', { name: 'Guardar vehículo' }))

    const message = await screen.findByText('Ya existe un vehículo con la placa HAA 1234')
    expect(message).toHaveAttribute('id', 'plate-description')
    expect(onUnhandledError).not.toHaveBeenCalled()
  })

  it('shows API validation errors next to the matching fields', async () => {
    const onSubmit = vi.fn().mockRejectedValue(
      new ApiError('Los datos enviados no son válidos', 400, {
        model: ['El modelo debe tener como máximo 50 caracteres'],
      }),
    )
    const { onUnhandledError, user } = renderForm(onSubmit)

    await fillValidVehicle(user)
    await user.click(screen.getByRole('button', { name: 'Guardar vehículo' }))

    expect(
      await screen.findByText('El modelo debe tener como máximo 50 caracteres'),
    ).toHaveAttribute('id', 'model-description')
    expect(onUnhandledError).not.toHaveBeenCalled()
  })

  it('hands other errors to the page (e.g. to show a toast)', async () => {
    const error = new ApiError('No se pudo conectar con el servidor. Verifique su conexión.', 0)
    const { onUnhandledError, user } = renderForm(vi.fn().mockRejectedValue(error))

    await fillValidVehicle(user)
    await user.click(screen.getByRole('button', { name: 'Guardar vehículo' }))

    await vi.waitFor(() => expect(onUnhandledError).toHaveBeenCalledWith(error))
  })
})
