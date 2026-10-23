import { ArrowRightArrowLeft } from '@primeicons/react/arrow-right-arrow-left'
import { Car } from '@primeicons/react/car'
import { List } from '@primeicons/react/list'
import { Plus } from '@primeicons/react/plus'
import { ThLarge } from '@primeicons/react/th-large'
import type { ComponentType } from 'react'
import { NavLink } from 'react-router'
import './Sidebar.scss'

type NavItem = {
  to: string
  label: string
  icon: ComponentType<{ 'aria-hidden'?: boolean | 'true' }>
}

type NavSection = {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'General',
    items: [{ to: '/', label: 'Panel', icon: ThLarge }],
  },
  {
    title: 'Movimientos',
    items: [
      { to: '/movements', label: 'Entradas y salidas', icon: List },
      { to: '/movements/new', label: 'Registrar movimiento', icon: ArrowRightArrowLeft },
    ],
  },
  {
    title: 'Flota',
    items: [
      { to: '/vehicles', label: 'Vehículos', icon: Car },
      { to: '/vehicles/new', label: 'Nuevo vehículo', icon: Plus },
    ],
  },
]

type SidebarProps = {
  id: string
  /** Only affects small screens, where the sidebar is off-canvas. */
  isOpen: boolean
}

export function Sidebar({ id, isOpen }: SidebarProps) {
  return (
    <aside id={id} className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo">
          <Car aria-hidden="true" />
        </span>
        <span>
          Vehicle Tracker
          <small>Control de flota</small>
        </span>
      </div>

      <nav aria-label="Navegación principal" className="sidebar__nav">
        {navSections.map(({ title, items }) => (
          <div key={title} className="sidebar__section">
            <h2 className="sidebar__section-title">{title}</h2>
            <ul className="sidebar__list">
              {items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  {/* `end` so "/movements" isn't highlighted while on "/movements/new" */}
                  <NavLink
                    to={to}
                    end
                    className={({ isActive }) =>
                      `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                    }
                  >
                    <Icon aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
