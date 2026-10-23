import { Button } from '@primereact/ui/button'
import { Link } from 'react-router'
import { PageHeader } from '../components/layout/PageHeader'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Página no encontrada" />
      <div className="card">
        <p>La página que busca no existe o fue movida.</p>
        <Button as={Link} to="/movements">
          Ir a entradas y salidas
        </Button>
      </div>
    </>
  )
}
