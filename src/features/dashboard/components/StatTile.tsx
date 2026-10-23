import type { ComponentType, ReactNode } from 'react'
import './StatTile.scss'

type StatTileProps = {
  label: string
  /** `undefined` while loading: shows a placeholder instead of a misleading 0. */
  value: number | undefined
  icon: ComponentType<{ 'aria-hidden'?: boolean | 'true' }>
  tone: 'primary' | 'entry' | 'exit' | 'neutral'
  hint?: ReactNode
}

const numberFormatter = new Intl.NumberFormat('es-HN')

/** One headline number with its label, for the dashboard's summary row. */
export function StatTile({ label, value, icon: Icon, tone, hint }: StatTileProps) {
  return (
    <article className={`stat-tile stat-tile--${tone}`} aria-busy={value === undefined}>
      <div className="stat-tile__header">
        <h2 className="stat-tile__label">{label}</h2>
        <span className="stat-tile__icon">
          <Icon aria-hidden="true" />
        </span>
      </div>
      <p className="stat-tile__value">
        {value === undefined ? (
          <span className="stat-tile__skeleton">
            <span className="visually-hidden">Cargando</span>
          </span>
        ) : (
          numberFormatter.format(value)
        )}
      </p>
      {hint && <p className="stat-tile__hint">{hint}</p>}
    </article>
  )
}
