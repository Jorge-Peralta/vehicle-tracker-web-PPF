import { ArrowRightArrowLeft } from '@primeicons/react/arrow-right-arrow-left'
import { Car } from '@primeicons/react/car'
import { List } from '@primeicons/react/list'
import { Plus } from '@primeicons/react/plus'
import type { ComponentType } from 'react'
import { NavLink } from 'react-router'
import './Sidebar.scss'

type NavItem = {
  to: string
  label: string
  icon: ComponentType<{ 'aria-hidden'?: boolean | 'true' }>
}

const navItems: NavItem[] = [
  { to: '/movements', label: 'Entradas y salidas', icon: List },
  { to: '/movements/new', label: 'Registrar movimiento', icon: ArrowRightArrowLeft },
  { to: '/vehicles', label: 'Vehículos', icon: Car },
  { to: '/vehicles/new', label: 'Nuevo vehículo', icon: Plus },
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
        <Car aria-hidden="true" />
        <span>Vehicle Tracker</span>
      </div>

      <nav aria-label="Navegación principal">
        <ul className="sidebar__list">
          {navItems.map(({ to, label, icon: Icon }) => (
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
      </nav>
    </aside>
  )
}
