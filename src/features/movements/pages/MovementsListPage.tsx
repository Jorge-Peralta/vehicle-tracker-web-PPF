import { Plus } from '@primeicons/react/plus'
import { Button } from '@primereact/ui/button'
import { Link } from 'react-router'
import { PageHeader } from '../../../components/layout/PageHeader'

// Placeholder: the filtered movements table is built in phase 8.
export function MovementsListPage() {
  return (
    <>
      <PageHeader
        title="Entradas y salidas"
        description="Historial de movimientos de los vehículos"
        actions={
          <Button as={Link} to="/movements/new">
            <Plus aria-hidden="true" />
            Registrar movimiento
          </Button>
        }
      />
      <div className="card">Próximamente: listado de entradas y salidas.</div>
    </>
  )
}
