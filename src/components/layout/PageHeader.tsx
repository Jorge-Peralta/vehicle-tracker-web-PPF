import { useEffect, type ReactNode } from 'react'
import './PageHeader.scss'

type PageHeaderProps = {
  title: string
  description?: string
  /** Buttons shown next to the title (stacked below it on small screens). */
  actions?: ReactNode
}

/** Page title block; also sets the browser tab title. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  useEffect(() => {
    document.title = `${title} · Vehicle Tracker`
  }, [title])

  return (
    <header className="page-header">
      <div>
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
