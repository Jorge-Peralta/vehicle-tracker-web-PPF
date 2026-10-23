import { Bars } from '@primeicons/react/bars'
import { Car } from '@primeicons/react/car'
import { Times } from '@primeicons/react/times'
import { Button } from '@primereact/ui/button'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AppToaster } from '../feedback/AppToaster'
import { ServerWakeUpNotice } from '../feedback/ServerWakeUpNotice'
import { Sidebar } from './Sidebar'
import './AppLayout.scss'

/**
 * Page frame: fixed sidebar on large screens; on small screens a top bar whose menu
 * button slides the same sidebar in over the content.
 */
export function AppLayout() {
  const { pathname } = useLocation()
  // The page where the mobile menu was opened; navigating anywhere else closes it.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null)
  const isMenuOpen = menuOpenedAt === pathname
  const closeMenu = () => setMenuOpenedAt(null)

  useEffect(() => {
    if (!isMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  return (
    <div className="app-layout">
      {/* First focusable element: lets keyboard users jump past the navigation. */}
      <a href="#main-content" className="app-layout__skip-link">
        Saltar al contenido principal
      </a>

      <header className="app-layout__topbar">
        <Button
          variant="text"
          severity="secondary"
          iconOnly
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="app-sidebar"
          onClick={() => (isMenuOpen ? closeMenu() : setMenuOpenedAt(pathname))}
        >
          {isMenuOpen ? <Times /> : <Bars />}
        </Button>
        <span className="app-layout__brand">
          <Car aria-hidden="true" /> Vehicle Tracker
        </span>
      </header>

      <Sidebar id="app-sidebar" isOpen={isMenuOpen} />
      {isMenuOpen && (
        <div className="app-layout__backdrop" aria-hidden="true" onClick={closeMenu} />
      )}

      <main id="main-content" className="app-layout__content" tabIndex={-1}>
        <ServerWakeUpNotice />
        {/* Pages are lazy-loaded (see AppRoutes); shown while a page's code downloads. */}
        <Suspense
          fallback={
            <p className="app-layout__page-loading" aria-busy="true">
              Cargando…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <AppToaster />
    </div>
  )
}
