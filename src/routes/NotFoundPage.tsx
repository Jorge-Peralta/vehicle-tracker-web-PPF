import { Compass } from '@primeicons/react/compass'
import { Button } from '@primereact/ui/button'
import { Link } from 'react-router'
import { PageHeader } from '../components/layout/PageHeader'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Página no encontrada" />
      <div className="card empty-state">
        <span className="empty-state__icon">
          <Compass aria-hidden="true" />
        </span>
        <p>La página que busca no existe o fue movida.</p>
        <Button as={Link} to="/">
          Ir al panel
        </Button>
      </div>
    </>
  )
}
