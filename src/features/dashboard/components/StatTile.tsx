import { Refresh } from '@primeicons/react/refresh'
import { Button } from '@primereact/ui/button'
import type { ComponentType, ReactNode } from 'react'
import './StatTile.scss'

type StatTileProps = {
  label: string
  /** `undefined` while loading: shows a placeholder instead of a misleading 0. */
  value: number | undefined
  icon: ComponentType<{ 'aria-hidden'?: boolean | 'true' }>
  tone: 'primary' | 'entry' | 'exit' | 'neutral'
  hint?: ReactNode
  /** Set when the value's request failed, so the tile stops looking like it's loading. */
  isError?: boolean
  onRetry?: () => void
}

const numberFormatter = new Intl.NumberFormat('es-HN')

/** One headline number with its label, for the dashboard's summary row. */
export function StatTile({
  label,
  value,
  icon: Icon,
  tone,
  hint,
  isError = false,
  onRetry,
}: StatTileProps) {
  const isLoading = value === undefined && !isError

  return (
    <article className={`stat-tile stat-tile--${tone}`} aria-busy={isLoading}>
      <div className="stat-tile__header">
        <h2 className="stat-tile__label">{label}</h2>
        <span className="stat-tile__icon">
          <Icon aria-hidden="true" />
        </span>
      </div>
      {isError ? (
        <div className="stat-tile__error">
          <p>No disponible</p>
          {onRetry && (
            <Button
              size="small"
              variant="text"
              severity="secondary"
              iconOnly
              aria-label={`Reintentar ${label.toLowerCase()}`}
              onClick={onRetry}
            >
              <Refresh aria-hidden="true" />
            </Button>
          )}
        </div>
      ) : (
        <p className="stat-tile__value">
          {value === undefined ? (
            <span className="stat-tile__skeleton">
              <span className="visually-hidden">Cargando</span>
            </span>
          ) : (
            numberFormatter.format(value)
          )}
        </p>
      )}
      {hint && !isError && <p className="stat-tile__hint">{hint}</p>}
    </article>
  )
}
