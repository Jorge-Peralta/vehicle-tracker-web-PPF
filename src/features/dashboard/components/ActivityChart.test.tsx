import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ActivityChart } from './ActivityChart'

describe('ActivityChart', () => {
  it('lists every day in an accessible table', () => {
    render(
      <ActivityChart
        data={[
          { date: '2026-03-09', entries: 2, exits: 0 },
          { date: '2026-03-10', entries: 1, exits: 3 },
        ]}
      />,
    )

    const rows = within(screen.getByRole('table', { name: 'Entradas y salidas por día' }))
      .getAllByRole('row')
      .slice(1)
      .map((row) => row.textContent)
    expect(rows).toEqual(['lun 920', 'mar 1013'])
  })

  it('shows a message instead of an empty plot when there are no days', () => {
    render(<ActivityChart data={[]} />)

    expect(screen.getByText('No hay datos de actividad.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
