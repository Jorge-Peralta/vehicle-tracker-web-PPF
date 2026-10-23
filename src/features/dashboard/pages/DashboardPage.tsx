import { AngleRight } from '@primeicons/react/angle-right'
import { Car } from '@primeicons/react/car'
import { ChartBar } from '@primeicons/react/chart-bar'
import { Plus } from '@primeicons/react/plus'
import { SignIn } from '@primeicons/react/sign-in'
import { SignOut } from '@primeicons/react/sign-out'
import { Button } from '@primereact/ui/button'
import { Tag } from '@primereact/ui/tag'
import { Link } from 'react-router'
import { getErrorMessage } from '../../../api/client'
import { PageHeader } from '../../../components/layout/PageHeader'
import { formatDateTime } from '../../../lib/dates'
import { formatMileage, formatPlate } from '../../../lib/formatters'
import { useMovements } from '../../movements/hooks/use-movements'
import { movementTypeLabels, movementTypeSeverity } from '../../movements/movement-labels'
import { useVehicles } from '../../vehicles/hooks/use-vehicles'
import { ActivityChart } from '../components/ActivityChart'
import { StatTile } from '../components/StatTile'
import { ACTIVITY_DAYS, useDailyActivity } from '../hooks/use-dashboard'
import './DashboardPage.scss'

const RECENT_COUNT = 6

export function DashboardPage() {
  const vehiclesQuery = useVehicles()
  const activity = useDailyActivity()
  const recentQuery = useMovements({ page: 1, pageSize: RECENT_COUNT })

  const today = activity.data?.at(-1)
  const weekTotal = activity.data?.reduce((sum, day) => sum + day.entries + day.exits, 0)
  // The three activity tiles share one request, so they fail and retry together.
  const activityErrorProps = {
    isError: activity.isError && !activity.data,
    onRetry: () => activity.refetch(),
  }

  return (
    <>
      <PageHeader
        title="Panel"
        description="Resumen de la actividad de la flota"
        actions={
          <>
            <Button as={Link} to="/vehicles/new" variant="outlined">
              <Car aria-hidden="true" />
              Nuevo vehículo
            </Button>
            <Button as={Link} to="/movements/new">
              <Plus aria-hidden="true" />
              Registrar movimiento
            </Button>
          </>
        }
      />

      <section className="dashboard__stats" aria-label="Indicadores">
        <StatTile
          label="Vehículos activos"
          value={vehiclesQuery.data?.length}
          icon={Car}
          tone="primary"
          hint={<Link to="/vehicles">Ver vehículos</Link>}
          isError={vehiclesQuery.isError && !vehiclesQuery.data}
          onRetry={() => vehiclesQuery.refetch()}
        />
        <StatTile
          label="Entradas hoy"
          value={today?.entries}
          icon={SignIn}
          tone="entry"
          {...activityErrorProps}
        />
        <StatTile
          label="Salidas hoy"
          value={today?.exits}
          icon={SignOut}
          tone="exit"
          {...activityErrorProps}
        />
        <StatTile
          label="Movimientos"
          value={weekTotal}
          icon={ChartBar}
          tone="neutral"
          hint={`Últimos ${ACTIVITY_DAYS} días`}
          {...activityErrorProps}
        />
      </section>

      <div className="dashboard__grid">
        <section className="card dashboard__panel" aria-labelledby="activity-title">
          <header className="dashboard__panel-header">
            <div>
              <h2 id="activity-title">Actividad semanal</h2>
              <p>Entradas y salidas de los últimos {ACTIVITY_DAYS} días</p>
            </div>
          </header>
          {activity.data ? (
            <ActivityChart data={activity.data} />
          ) : activity.error ? (
            <div className="dashboard__state" role="alert">
              <p>{getErrorMessage(activity.error)}</p>
              <Button size="small" variant="outlined" onClick={() => activity.refetch()}>
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="dashboard__chart-skeleton" aria-busy="true">
              <span className="visually-hidden">Cargando actividad…</span>
            </div>
          )}
        </section>

        <section className="card dashboard__panel" aria-labelledby="recent-title">
          <header className="dashboard__panel-header">
            <div>
              <h2 id="recent-title">Movimientos recientes</h2>
              <p>Últimas entradas y salidas registradas</p>
            </div>
            <Link to="/movements" className="dashboard__see-all">
              Ver todo <AngleRight aria-hidden="true" />
            </Link>
          </header>

          {recentQuery.isPending ? (
            <p className="dashboard__state">Cargando movimientos…</p>
          ) : recentQuery.error ? (
            <div className="dashboard__state" role="alert">
              <p>{getErrorMessage(recentQuery.error)}</p>
              <Button size="small" variant="outlined" onClick={() => recentQuery.refetch()}>
                Reintentar
              </Button>
            </div>
          ) : recentQuery.data.data.length === 0 ? (
            <div className="dashboard__state">
              <p>Aún no hay entradas ni salidas registradas.</p>
              <Button as={Link} to="/movements/new" size="small">
                <Plus aria-hidden="true" />
                Registrar el primero
              </Button>
            </div>
          ) : (
            <ul className="recent-movements">
              {recentQuery.data.data.map((movement) => {
                const isEntry = movement.type === 'ENTRY'
                return (
                  <li key={movement.id} className="recent-movements__item">
                    <span
                      className={`recent-movements__icon recent-movements__icon--${isEntry ? 'entry' : 'exit'}`}
                    >
                      {isEntry ? <SignIn aria-hidden="true" /> : <SignOut aria-hidden="true" />}
                    </span>
                    <div className="recent-movements__main">
                      <span className="recent-movements__plate">
                        {formatPlate(movement.vehicle.plate)}
                        <span className="recent-movements__model">
                          {movement.vehicle.brand} {movement.vehicle.model}
                        </span>
                      </span>
                      <span className="recent-movements__meta">
                        {movement.driver.fullName} · {formatMileage(movement.mileage)}
                      </span>
                    </div>
                    <div className="recent-movements__side">
                      <Tag severity={movementTypeSeverity[movement.type]}>
                        {movementTypeLabels[movement.type]}
                      </Tag>
                      <time dateTime={movement.occurredAt} className="recent-movements__time">
                        {formatDateTime(movement.occurredAt)}
                      </time>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
