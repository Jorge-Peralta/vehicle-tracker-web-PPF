import { Plus } from '@primeicons/react/plus'
import { Button } from '@primereact/ui/button'
import { Link } from 'react-router'
import { PageHeader } from '../../../components/layout/PageHeader'

// Placeholder: the vehicle table is built in phase 7.
export function VehiclesListPage() {
  return (
    <>
      <PageHeader
        title="Vehículos"
        description="Vehículos registrados"
        actions={
          <Button as={Link} to="/vehicles/new">
            <Plus aria-hidden="true" />
            Nuevo vehículo
          </Button>
        }
      />
      <div className="card">Próximamente: listado de vehículos.</div>
    </>
  )
}
