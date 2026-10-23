import { useParams } from 'react-router'
import { PageHeader } from '../../../components/layout/PageHeader'

// Placeholder: the create/edit form is built in phase 7.
export function VehicleFormPage() {
  const { id } = useParams()
  const isEditing = id !== undefined

  return (
    <>
      <PageHeader title={isEditing ? 'Editar vehículo' : 'Nuevo vehículo'} />
      <div className="card">Próximamente: formulario de vehículo.</div>
    </>
  )
}
