import { PrimeReactProvider } from '@primereact/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchDailySummary, fetchMovements } from '../../movements/api/movements-api'
import { fetchVehicles } from '../../vehicles/api/vehicles-api'
import { DashboardPage } from './DashboardPage'

vi.mock('../../movements/api/movements-api')
vi.mock('../../vehicles/api/vehicles-api')

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    </PrimeReactProvider>,
  )
  return userEvent.setup()
}

function tile(label: string) {
  return screen.getByRole('heading', { name: label }).closest('article')!
}

beforeEach(() => {
  vi.mocked(fetchMovements).mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 6 })
  vi.mocked(fetchDailySummary).mockResolvedValue([
    { date: '2026-03-09', entries: 2, exits: 1 },
    { date: '2026-03-10', entries: 4, exits: 3 },
  ])
  vi.mocked(fetchVehicles).mockResolvedValue([])
})

describe('DashboardPage', () => {
  it("shows today's entries and exits and the week total", async () => {
    renderPage()

    expect(await screen.findByText('10')).toBeInTheDocument()
    expect(tile('Entradas hoy')).toHaveTextContent('4')
    expect(tile('Salidas hoy')).toHaveTextContent('3')
    expect(tile('Vehículos activos')).toHaveTextContent('0')
  })

  it('shows an error with a retry button instead of loading forever when a tile fails', async () => {
    vi.mocked(fetchVehicles).mockRejectedValueOnce(new Error('Network Error'))
    const user = renderPage()

    const retry = await screen.findByRole('button', { name: 'Reintentar vehículos activos' })
    expect(tile('Vehículos activos')).toHaveTextContent('No disponible')
    expect(tile('Vehículos activos')).toHaveAttribute('aria-busy', 'false')

    await user.click(retry)

    expect(await screen.findByText('Ver vehículos')).toBeInTheDocument()
    expect(tile('Vehículos activos')).toHaveTextContent('0')
  })

  it('marks the activity tiles as unavailable when the summary fails', async () => {
    vi.mocked(fetchDailySummary).mockRejectedValue(new Error('Network Error'))
    renderPage()

    expect(
      await screen.findByRole('button', { name: 'Reintentar entradas hoy' }),
    ).toBeInTheDocument()
    expect(tile('Salidas hoy')).toHaveTextContent('No disponible')
    expect(tile('Movimientos')).toHaveTextContent('No disponible')
  })
})
